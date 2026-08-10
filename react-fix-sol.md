# React Performance Fixes & Solutions

Audit of `graplmsclone` against Vercel React Best Practices.

## 1. Route-level code splitting (CRITICAL — `bundle-dynamic-imports`)

**Problem:** Initial bundle is 341 kB JS (94.5 kB gzip); all views ship upfront.

**Fix** in `src/App.tsx` — lazy-load every view except the dashboard shell:

```tsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

const MainContent = lazy(() => import("./components/MainContent"));
const CoursesView = lazy(() => import("./components/CoursesView"));
const CreateCourseView = lazy(() => import("./components/CreateCourseView"));
const CourseBuilderView = lazy(() => import("./components/CourseBuilderView"));
const CourseInfoView = lazy(() => import("./components/CourseInfoView"));

export default function App() {
  return (
    <BrowserRouter>
      <CourseProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<MainContent />} />
              <Route path="courses" element={<CoursesView />} />
              <Route path="courses/create" element={<CreateCourseView />} />
              <Route path="courses/builder" element={<CourseBuilderView />} />
              <Route path="courses/:courseId/builder" element={<CourseBuilderView />} />
              <Route path="courses/:courseId" element={<CourseInfoView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </CourseProvider>
    </BrowserRouter>
  );
}
```

Also lazy-load `ItemModal` in `CourseBuilderView.tsx:26` (only needed when a modal opens):

```tsx
const ItemModal = lazy(() => import("./ItemModal").then((m) => ({ default: m.ItemModal })));
```

## 2. Debounce + version localStorage writes (MEDIUM-HIGH — `client-localstorage-schema`)

**Problem:** `src/context/CourseContext.tsx:104-118` runs `JSON.stringify` + `setItem` on the main thread after every change. Every builder keystroke serializes the entire courses array and draft. No versioning/size guard.

**Fix:**

```tsx
useEffect(() => {
  const t = setTimeout(() => {
    try { localStorage.setItem(COURSES_KEY, JSON.stringify(courses)); } catch {}
  }, 300);
  return () => clearTimeout(t);
}, [courses]);
```

- Version the keys: `"graplms-courses@1"`, `"graplms-draft@1"`.
- Keep the `useState(loadCourses)` lazy initializers (already correct).

## 3. Reset `CourseInfoView` state with `key`, not an effect (MEDIUM — `rerender-derived-state-no-effect`)

**Problem:** `CourseInfoView.tsx:92-105` uses a `useEffect` on `course?.id` to reset ~10 `useState`s when the param changes.

**Fix** — force a remount per course and delete the effect. Add a keyed wrapper in `App.tsx`:

```tsx
function CourseInfoRoute() {
  const { courseId } = useParams();
  return <CourseInfoView key={courseId} />;
}
// route: <Route path="courses/:courseId" element={<CourseInfoRoute />} />
```

Then `useState(course.title)` etc. are plain initializers again.

## 4. Stabilize context functions with `useCallback` (LOW-MEDIUM — `rerender-dependencies`)

**Problem:** All functions in `CourseContext` are recreated every render; `CourseBuilderView.tsx:57-60` lists `startEditCourse` in an effect dep array (fragile).

**Fix:** Wrap context callbacks in `useCallback` and list them in the `useMemo` deps (`CourseContext.tsx:196-212`). Makes the context value stable and effects safe.

## 5. Defer course search (LOW — `rerender-use-deferred-value` + `rerender-memo`)

**Fix** in `CoursesView.tsx:80-83`:

```tsx
const deferredSearch = useDeferredValue(searchTerm);
const filteredCourses = courses.filter((c) =>
  c.title.toLowerCase().includes(deferredSearch.trim().toLowerCase())
);
```

Optionally `React.memo(CourseCard)` + `useCallback` on `onOpen`/`onOpenBuilder`. Skip unless the list grows.

## 6. Delete dead components (LOW — `bundle-*`)

`ActionCard.tsx` and `StatsCard.tsx` are never imported. Delete them.

## 7. Preconnect to image CDN (LOW — `rendering-resource-hints`)

Add to `index.html`:

```html
<link rel="preconnect" href="https://d502jbuhuh9wk.cloudfront.net" />
```

## 8. lucide-react imports (no change needed — `bundle-barrel-imports`)

Named imports already tree-shake under Vite. Deep imports (`lucide-react/icons/Wrench`) are optional, marginal.

## Already compliant (no action)

- No inline component definitions (`CourseCard`, `NavItem`, `EditorToolbar` are module-level)
- `&&` conditionals all guard booleans (no `rendering-conditional-render` bug)
- `saveCourse` early-exits on empty title; filters are single-pass
- No global listeners / fetch waterfalls / server code (async-* and server-* N/A)

**Suggested order:** 1 → 3 → 4 → 2 → 5 → 6 → 7.
