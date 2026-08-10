import { useState } from "react";
import {
  Plus,
  Info,
  Users,
  Eye,
  Search,
  X,
  CheckCircle,
  Copy,
  FolderKanban,
  Wrench,
  Brush,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCourses, type Course } from "../context/CourseContext";

const covers = [
  "https://d502jbuhuh9wk.cloudfront.net/resources/images/cc3.jpg",
  "https://d502jbuhuh9wk.cloudfront.net/resources/images/cc6.jpg",
];

function relativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

function CourseCard({ course, onOpen, onOpenBuilder }: { course: Course; onOpen: () => void; onOpenBuilder: () => void }) {
  const cover = course.cover ?? covers[course.id % covers.length];
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-2xs flex flex-col justify-between">
      <div>
        <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer" onClick={onOpen}>
          <div className="absolute inset-0 bg-cover bg-center filter blur-xs opacity-50" style={{ backgroundImage: `url(${cover})` }} />
          <div className="relative block h-full">
            <img src={cover} alt={course.title} className="w-full h-full object-cover relative z-10" />
          </div>
        </div>
        <div className="p-5 space-y-2">
          <div onClick={onOpen} className="text-lg font-bold text-gray-900 hover:underline block truncate cursor-pointer">{course.title}</div>
          <span className="text-xs text-gray-500 block">chandrahas</span>
          <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
            <span>Enrolled Learners: <b className="text-indigo-900 font-bold">0</b></span>
            <span className="text-gray-400">{relativeTime(course.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-around">
        <button onClick={onOpen} className="p-2 text-gray-600 hover:text-indigo-900 rounded-lg hover:bg-white transition-colors" title="Details"><Info size={18} /></button>
        <button onClick={onOpenBuilder} className="p-2 text-gray-600 hover:text-indigo-900 rounded-lg hover:bg-white transition-colors" title="Course Builder"><Wrench size={18} /></button>
        <button className="p-2 text-gray-600 hover:text-indigo-900 rounded-lg hover:bg-white transition-colors" title="Landing Page Design"><Brush size={18} /></button>
        <button className="p-2 text-gray-600 hover:text-indigo-900 rounded-lg hover:bg-white transition-colors" title="Learners"><Users size={18} /></button>
        <button className="p-2 text-gray-600 hover:text-indigo-900 rounded-lg hover:bg-white transition-colors" title="Course Preview"><Eye size={18} /></button>
        <button className="p-2 text-gray-600 hover:text-indigo-900 rounded-lg hover:bg-white transition-colors" title="Course Discussions"><MessageSquare size={18} /></button>
      </div>
    </div>
  );
}

export function CoursesView() {
  const { courses, startNewCourse, loading } = useCourses();
  const navigate = useNavigate();
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openCourse = (id: number) => navigate(`/courses/${id}`);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div id="allcourses" className="container mx-auto px-6 py-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Courses (<b id="totalcourses" className="text-indigo-900">{courses.length}</b>)
          <button
            onClick={() => {
              startNewCourse();
              navigate("/courses/create");
            }}
            className="ml-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900 createCourseBtn"
          >
            <Plus size={18} />
            <span className="hide-sm">Create Course</span>
          </button>
          <small className="text-xs font-normal text-gray-500 ml-2 hidelearnmore hidden sm:inline">
            Set up your courses and share your knowledge.{" "}
            <a
              href="https://help.graphy.com/support/solutions/articles/1060000132411-how-to-create-a-course-"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline font-medium"
            >
              Learn more
            </a>
          </small>
        </h3>
      </div>

      {/* Search and Filters */}
      <div className="docs-note bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-10/12">
            <div className="relative flex items-center w-full">
              <span className="absolute left-3 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                id="searchCourse"
                placeholder="Search by Course Title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="w-full md:w-2/12 flex justify-end">
            <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
              <button className="rounded-md p-1.5 text-gray-500 hover:bg-white hover:text-gray-900" data-mode="list">
                <FolderKanban size={18} />
              </button>
              <button className="rounded-md bg-white p-1.5 text-indigo-900 shadow-2xs" data-mode="grid">
                <Wrench size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div id="courseslist" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onOpen={() => openCourse(course.id)}
            onOpenBuilder={() => navigate(`/courses/${course.id}/builder`)}
          />
        ))}
      </div>

      {!loading && filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="text-gray-300">
            <FolderKanban size={48} />
          </div>
          <p className="text-base font-semibold text-gray-900">No courses yet</p>
          <p className="text-sm text-gray-500">Click "Create Course" to build your first course.</p>
        </div>
      )}

      {/* PUBLISHED SUCCESS MODAL */}
      {isPublishedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-emerald-600">
                <CheckCircle size={22} /> Your course has been published!
              </h3>
              <button onClick={() => setIsPublishedModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Go ahead and spread the word.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://graphy.com/courses/preview"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-600"
                />
                <button className="rounded-lg bg-indigo-950 px-3 py-2 text-white hover:bg-indigo-900">
                  <Copy size={16} />
                </button>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setIsPublishedModalOpen(false)}
                  className="rounded-lg bg-indigo-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-900"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}