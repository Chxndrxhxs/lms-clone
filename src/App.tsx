import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CourseProvider } from "./context/CourseContext";
import { DashboardLayout } from "./components/DashboardLayout";
import { MainContent } from "./components/MainContent";
import { CoursesView } from "./components/CoursesView";
import { CreateCourseView } from "./components/CreateCourseView";
import { CourseBuilderView } from "./components/CourseBuilderView";
import { CourseInfoView } from "./components/CourseInfoView";
import { CoursePlayerView } from "./components/CoursePlayerView";

export default function App() {
  return (
    <BrowserRouter>
      <CourseProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<MainContent />} />
            <Route path="courses" element={<CoursesView />} />
            <Route path="courses/create" element={<CreateCourseView />} />
            <Route path="courses/builder" element={<CourseBuilderView />} />
            <Route path="courses/:courseId/builder" element={<CourseBuilderView />} />
            <Route path="courses/:courseId" element={<CourseInfoView />} />
          </Route>
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="courses/:courseId/preview" element={<CoursePlayerView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CourseProvider>
    </BrowserRouter>
  );
}
