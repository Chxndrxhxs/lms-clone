# UI Implementation Plan: Dashboard

## 1. Goal
Implement the dashboard layout observed in the provided screenshot, following React + Tailwind CSS v4 best practices.

## 2. Tech Stack
- React
- Tailwind CSS v4

## 3. UI Specification Summary
- **Layout:** Sidebar (fixed/sticky) + Header (sticky) + Main Content (scrollable).
- **Design System:**
    - Colors: `gray-50` (bg), `gray-900` (text), `indigo-900` (primary button), `amber-50`, `teal-50`, `indigo-50` (card backgrounds).
    - Typography: Inter/System UI.
    - Spacing: 8px base.
    - Radius: `lg`.

## 4. Implementation Steps
1.  **Project Setup:** Scaffold basic React + Tailwind v4 project.
2.  **Layout Scaffolding:** Create `DashboardLayout` component.
3.  **Component Building:**
    - `Sidebar`: Navigation links and user profile footer.
    - `Header`: Title and profile action.
    - `MainContent`: Grid container for dashboard widgets.
4.  **Widget Implementation:**
    - `StatsCard`
    - `ActionCard` (Banner style)
5.  **Refinement:** Apply consistent spacing, typography, and responsive adjustments.

## 5. Assumptions
- Tailwind v4 configuration will use standard imports.
- `lucide-react` will be used for icons.
