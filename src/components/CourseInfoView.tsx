import { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  Info,
  Wrench,
  Brush,
  Users,
  BadgeCheck,
  Pencil,
  Copy,
  Trash2,
  ChevronDown,
  Save,
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useCourses } from "../context/CourseContext";
import { courseApi } from "../api/courses";
import { MarkdownEditor } from "./MarkdownEditor";

type InfoTab = "details" | "pricing" | "pages" | "advanced";

const covers = [
  "https://d502jbuhuh9wk.cloudfront.net/resources/images/cc3.jpg",
  "https://d502jbuhuh9wk.cloudfront.net/resources/images/cc6.jpg",
];

function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

export function CourseInfoView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, loading, updateCourse, deleteCourse } = useCourses();
  const course = courses.find((c) => c.id === Number(courseId));

  const [tab, setTab] = useState<InfoTab>("details");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState(course?.title ?? "");
  const [tags, setTags] = useState(course?.tags ?? "");
  const [instructor, setInstructor] = useState(course?.instructor ?? "chandrahas");
  const [description, setDescription] = useState(course?.description ?? "");
  const [tagline, setTagline] = useState(course?.tagline ?? "");
  const [language, setLanguage] = useState(course?.language ?? "");
  const [courseUrl, setCourseUrl] = useState((course?.title ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  const [canonicalUrl, setCanonicalUrl] = useState(course?.canonicalUrl ?? "");
  const [seoTitle, setSeoTitle] = useState(course?.title ?? "");
  const [seoDescription, setSeoDescription] = useState(course?.seoDescription ?? "");
  const [category, setCategory] = useState(course?.category ?? "");
  const [featuredPriority, setFeaturedPriority] = useState(course?.featuredPriority ?? 0);
  const [taxRate, setTaxRate] = useState(course?.taxRate ?? "18");
  const [showValidity, setShowValidity] = useState(course?.showValidity ?? true);
  const [accessChannels, setAccessChannels] = useState<string[]>(
    course?.accessChannels && course.accessChannels.length > 0 ? course.accessChannels : ["all", "android"]
  );
  const [offlineUsage, setOfflineUsage] = useState(course?.offlineUsage ?? true);
  const [showCurriculumInfo, setShowCurriculumInfo] = useState(course?.showCurriculumInfo ?? true);
  const [allowBookmarks, setAllowBookmarks] = useState(course?.allowBookmarks ?? true);
  const [welcomeEmailEnabled, setWelcomeEmailEnabled] = useState(course?.welcomeEmailEnabled ?? false);
  const [welcomeEmailSubject, setWelcomeEmailSubject] = useState(course?.welcomeEmailSubject ?? "");
  const [welcomeEmailContent, setWelcomeEmailContent] = useState(course?.welcomeEmailContent ?? "");

  useEffect(() => {
    setTab("details");
    setShowAdvanced(false);
    setTitle(course?.title ?? "");
    setTags(course?.tags ?? "");
    setInstructor(course?.instructor ?? "chandrahas");
    setDescription(course?.description ?? "");
    setTagline(course?.tagline ?? "");
    setLanguage(course?.language ?? "");
    setCourseUrl((course?.title ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    setCanonicalUrl(course?.canonicalUrl ?? "");
    setSeoTitle(course?.title ?? "");
    setSeoDescription(course?.seoDescription ?? "");
    setCategory(course?.category ?? "");
    setFeaturedPriority(course?.featuredPriority ?? 0);
    setTaxRate(course?.taxRate ?? "18");
    setShowValidity(course?.showValidity ?? true);
    setAccessChannels(
      course?.accessChannels && course.accessChannels.length > 0 ? course.accessChannels : ["all", "android"]
    );
    setOfflineUsage(course?.offlineUsage ?? true);
    setShowCurriculumInfo(course?.showCurriculumInfo ?? true);
    setAllowBookmarks(course?.allowBookmarks ?? true);
    setWelcomeEmailEnabled(course?.welcomeEmailEnabled ?? false);
    setWelcomeEmailSubject(course?.welcomeEmailSubject ?? "");
    setWelcomeEmailContent(course?.welcomeEmailContent ?? "");
  }, [course?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm text-[#6B7280]">Loading course...</div>
      </div>
    );
  }

  if (!course) return <Navigate to="/courses" replace />;

  const cover = course.cover ?? covers[course.id % covers.length];
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await courseApi.uploadFile(file);
      updateCourse(course.id, { cover: result.url });
    } catch (err) {
      console.error("Cover upload failed", err);
    }
  };

  const saveDetails = () => {
    updateCourse(course.id, {
      title,
      description,
      tags,
      instructor,
      tagline,
      language,
      showValidity,
      accessChannels,
      offlineUsage,
      showCurriculumInfo,
      allowBookmarks,
    });
  };

  const savePricing = () => {
    updateCourse(course.id, {
      category,
      featuredPriority: Number(featuredPriority) || 0,
      taxRate,
    });
  };

  const savePages = () => {
    updateCourse(course.id, { courseUrl, canonicalUrl, seoTitle, seoDescription });
  };

  const saveAdvanced = () => {
    updateCourse(course.id, {
      showValidity,
      accessChannels,
      offlineUsage,
      showCurriculumInfo,
      allowBookmarks,
      welcomeEmailEnabled,
      welcomeEmailSubject,
      welcomeEmailContent,
    });
  };

  const toggleChannel = (value: string) => {
    setAccessChannels((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleDelete = () => {
    deleteCourse(course.id);
    navigate("/courses");
  };

  const navItems = [
    { label: "Information", icon: Info, active: true },
    { label: "Course Builder", icon: Wrench },
    { label: "Landing Page", icon: Brush },
    { label: "Learners", icon: Users },
    { label: "Certificates", icon: BadgeCheck },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Inner sidebar */}
      <aside className="w-48 shrink-0 border-r border-[#ECEEEF] bg-[#F8F9FA] flex flex-col">
        <div className="relative px-6 pt-4 pb-2">
          <img src={cover} alt={course.title} className="w-full object-cover aspect-video" />
          <button
            className="absolute bottom-0 right-6 flex h-7 w-7 items-center justify-center bg-[#0F1013] text-white hover:bg-[#393F41]"
            title="Upload cover"
            onClick={() => coverInputRef.current?.click()}
          >
            <Pencil size={13} />
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </div>
        <div className="mt-4 text-center text-sm font-semibold text-[#0F1013] px-2 truncate">{course.title}</div>
        <div className="mt-2 flex flex-col items-center gap-1 text-xs text-[#6B7280]">
          <span className="chip bg-[#ECEEEF] px-2 py-0.5">
            Created: <b className="text-[#393F41]">{formatDate(course.createdAt)}</b>
          </span>
          <span className="chip bg-[#ECEEEF] px-2 py-0.5">
            Modified: <b className="text-[#393F41]">{formatDate(course.updatedAt ?? course.createdAt)}</b>
          </span>
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 flex items-center gap-2 px-6 py-2 text-sm text-[#4E5DE0] bg-[#EEEFFF] hover:bg-[#E4E7FF]"
        >
          <ArrowLeft size={16} />
          <span>Back to courses</span>
        </button>

        <nav className="mt-4 px-4 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "Information";
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === "Course Builder") {
                    navigate(`/courses/${course.id}/builder`);
                  } else if (isActive) setTab("details");
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm ${
                  isActive ? "bg-white font-semibold text-[#0F1013] border border-[#ECEEEF]" : "text-[#393F41] hover:bg-[#ECEEEF]"
                }`}
              >
                <Icon size={16} className="text-[#4E5DE0]" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-grow min-w-0 p-6">
        <h3 className="text-xl font-semibold text-[#0F1013] mb-4">Information</h3>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#ECEEEF] mb-6">
          {(["details", "pricing", "pages", "advanced"] as InfoTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm capitalize ${
                tab === t
                  ? "border-b-2 border-[#4E5DE0] font-semibold text-[#4E5DE0]"
                  : "text-[#6B7280] hover:text-[#393F41]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveDetails();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Title: *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">
                  Tags <small className="text-[#6B7280] font-normal">comma separated for multiple tags</small>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="Tags"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Instructor Display Name: *</label>
                <input
                  type="text"
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="Instructor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Instructor</label>
                <input
                  type="text"
                  className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="Add Instructor"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-[#0F1013]">Description: *</label>
                </div>
                <MarkdownEditor
                  value={description}
                  onChange={setDescription}
                  minHeight={200}
                  placeholder="Write your course description in Markdown..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Course Tagline</label>
                <div className="border border-[#C9CED3] overflow-hidden">
                  <textarea
                    rows={4}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full resize-none outline-none p-4 text-sm text-[#393F41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Language: *</label>
                <input
                  type="text"
                  required
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="Language"
                />
              </div>

              {/* Advanced options */}
              <div className="border-t border-[#ECEEEF] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((s) => !s)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#4E5DE0] hover:text-[#4350C8]"
                >
                  Show Advanced Options
                  <ChevronDown size={16} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </button>
                {showAdvanced && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F1013] mb-1.5">
                        Show validity to learners (my courses)
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="showValidity"
                            checked={showValidity}
                            onChange={() => setShowValidity(true)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          Yes
                        </label>
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="showValidity"
                            checked={!showValidity}
                            onChange={() => setShowValidity(false)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F1013] mb-1.5">
                        Course can be accessed through
                      </label>
                      <div className="flex flex-wrap gap-5">
                        {[
                          ["all", "All"],
                          ["website", "Website"],
                          ["android", "Android App"],
                          ["ios", "iOS App"],
                        ].map(([v, l]) => (
                          <label key={v} className="flex items-center gap-2 text-sm text-[#393F41]">
                            <input
                              type="checkbox"
                              className="accent-[#4E5DE0]"
                              checked={accessChannels.includes(v)}
                              onChange={() => toggleChannel(v)}
                            />
                            {l}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F1013] mb-1.5">
                        Allow offline usage on Mobile apps
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="offline"
                            checked={offlineUsage}
                            onChange={() => setOfflineUsage(true)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          Yes
                        </label>
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="offline"
                            checked={!offlineUsage}
                            onChange={() => setOfflineUsage(false)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F1013] mb-1.5">
                        Show additional info (like duration, pages, etc) in Course Curriculum
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="curriculum"
                            checked={!showCurriculumInfo}
                            onChange={() => setShowCurriculumInfo(false)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          No
                        </label>
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="curriculum"
                            checked={showCurriculumInfo}
                            onChange={() => setShowCurriculumInfo(true)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          Yes
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Allow Bookmark Course Items</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="bookmark"
                            checked={!allowBookmarks}
                            onChange={() => setAllowBookmarks(false)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          No
                        </label>
                        <label className="flex items-center gap-2 text-sm text-[#393F41]">
                          <input
                            type="radio"
                            name="bookmark"
                            checked={allowBookmarks}
                            onChange={() => setAllowBookmarks(true)}
                            className="accent-[#4E5DE0]"
                          />{" "}
                          Yes
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#4E5DE0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </form>

            <div className="hidden lg:block text-sm text-justify text-[#6B7280] p-4">
              <div className="mt-44">
                <b>Description:</b> This is visible to learners before they subscribe to the course. This should include
                complete information about the course, which can influence the learners to subscribe to the course.
              </div>
              <div className="mt-16">
                <b>Course Tagline:</b> This is visible below title on description page. This should include concise
                information about the course.
              </div>
            </div>
          </div>
        )}

        {tab === "pricing" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0F1013] mb-1.5">List course for sale</label>
              <div className="flex flex-wrap gap-5">
                {[
                  ["true", "Website"],
                  ["android", "Android"],
                  ["ios", "iOS"],
                  ["false", "None"],
                ].map(([v, l]) => (
                  <label key={v} className="flex items-center gap-2 text-sm text-[#393F41]">
                    <input type="checkbox" className="accent-[#4E5DE0]" defaultChecked={v === "true" || v === "android"} disabled={v === "ios"} />
                    {l}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-[#0F1013]">
                Active Pricing Plans <span className="text-[#6B7280] font-normal">(1/6)</span>
              </h4>
              <button type="button" className="inline-flex items-center gap-1 border border-[#C9CED3] bg-white px-3 py-1.5 text-sm font-medium text-[#4E5DE0] hover:bg-[#F7F9FA]">
                Add plan
              </button>
            </div>

            <div className="border border-[#ECEEEF] bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[#393F41]">
                    {course.pricing.planType === "FREE" ? "Free" : "One-time"}
                  </span>
                  <span className="bg-[#F2F4FF] px-2 py-0.5 text-xs font-medium text-[#4E5DE0]">
                    {course.pricing.planType === "FREE" ? "Free" : "One-time"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#0F1013]">
                    {course.pricing.planType === "FREE" ? "₹0" : `₹${course.pricing.price || "0"}`}
                  </span>
                  <button className="p-1.5 text-[#9AA1A8] hover:text-[#4E5DE0]" title="Copy checkout link">
                    <Copy size={16} />
                  </button>
                  <button className="p-1.5 text-[#9AA1A8] hover:text-[#4E5DE0]" title="Edit plan">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-semibold text-[#0F1013]">Tax Settings</h4>
              <div className="flex items-center justify-between max-w-sm">
                <label className="text-sm text-[#393F41]">Tax Rate (in %)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-32 border border-[#C9CED3] px-3 py-2 text-sm text-[#393F41]"
                />
              </div>
              <div className="flex items-center justify-between max-w-sm">
                <label className="text-sm text-[#393F41]">Show Pricing including taxes</label>
                <span className="text-sm text-[#393F41]">
                  <input type="radio" name="taxinc" defaultChecked className="accent-[#4E5DE0]" /> Yes
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-semibold text-[#0F1013]">Other Settings</h4>
              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">
                  Category [*] <small className="text-[#6B7280] font-normal">Multiple categories should be comma separated</small>
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full max-w-sm border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="Category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Featured course Priority (0-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={featuredPriority}
                  onChange={(e) => setFeaturedPriority(Number(e.target.value))}
                  className="w-full max-w-sm border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={savePricing}
                className="bg-[#4E5DE0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {tab === "pages" && (
          <form
            className="max-w-3xl space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              savePages();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Course Page Url: *</label>
              <input
                type="text"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
                className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                placeholder="URL"
              />
              <p className="mt-1.5 text-xs text-[#6B7280]">Only hyphen, alphabets and numbers allowed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Canonical Url</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                placeholder="URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1013] mb-1.5">App Deep Link</label>
              <div className="flex gap-2">
                <input readOnly value="https://chandrahas2124.graphy.com/l/DkdnPbg" className="w-full border border-[#C9CED3] bg-gray-50 px-3 py-2.5 text-sm text-[#6B7280]" />
                <button type="button" className="border border-[#C9CED3] bg-white px-3 text-sm font-medium text-[#4E5DE0] hover:bg-[#F7F9FA]">
                  Copy
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Course Page Title: *</label>
              <input
                type="text"
                required
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                placeholder="SEO Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Course Page Description</label>
              <textarea
                rows={4}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                placeholder="SEO Description"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 bg-[#4E5DE0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]">
                <Save size={16} /> Save
              </button>
            </div>
          </form>
        )}

        {tab === "advanced" && (
          <div className="max-w-3xl space-y-10">
            <div>
              <h4 className="text-base font-semibold text-[#0F1013] mb-1">Course Welcome Email</h4>
              <p className="text-sm text-[#6B7280] mb-4">This email is sent to the learner when they are enrolled in this course.</p>
              <label className="flex items-center gap-2 text-sm text-[#393F41] mb-3">
                <input
                  type="checkbox"
                  className="accent-[#4E5DE0]"
                  checked={welcomeEmailEnabled}
                  onChange={(e) => setWelcomeEmailEnabled(e.target.checked)}
                />
                Send email to learner on course enrollment.
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={welcomeEmailSubject}
                    onChange={(e) => setWelcomeEmailSubject(e.target.value)}
                    className="w-full max-w-sm border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Content</label>
                  <textarea
                    rows={6}
                    value={welcomeEmailContent}
                    onChange={(e) => setWelcomeEmailContent(e.target.value)}
                    className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={saveAdvanced}
                  className="inline-flex items-center gap-2 bg-[#4E5DE0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between border-t border-[#ECEEEF] pt-6">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#0F1013]">Copy course</h4>
                <p className="text-sm text-[#6B7280] mt-1">This will create copy of your course.</p>
                <button className="mt-3 inline-flex items-center gap-2 bg-[#4E5DE0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]">
                  <Copy size={16} /> Copy course
                </button>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#0F1013]">Delete course</h4>
                <p className="text-sm text-[#6B7280] mt-1">
                  This will permanently delete your course. Though Learners who have purchased it will continue to have
                  access till their subscription ends.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-3 inline-flex items-center gap-2 bg-[#FEE2E2] px-5 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-[#FECACA]"
                >
                  <Trash2 size={16} /> Delete course
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#ECEEEF] px-6 py-4">
              <div className="text-base font-semibold text-[#0F1013]">Delete course</div>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-[#9AA1A8] hover:text-[#393F41]">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-justify text-[#6B7280]">
                Are you sure you want to permanently delete <b>{course.title}</b>?
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-[#C9CED3] bg-white px-4 py-2 text-sm font-medium text-[#393F41] hover:bg-[#F7F9FA]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#DC2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#B91C1C]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
