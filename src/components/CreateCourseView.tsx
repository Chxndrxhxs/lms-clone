import { useState } from "react";
import {
  Info,
  Lightbulb,
  Star,
  Wand2,
  RefreshCw,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Toast } from "./Toast";
import { MarkdownEditor } from "./MarkdownEditor";
import { useCourses } from "../context/CourseContext";

export function CreateCourseView() {
  const { draft, updateDraft } = useCourses();
  const navigate = useNavigate();
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);
  const [planType, setPlanType] = useState(draft.pricing.planType);
  const [mrp, setMrp] = useState(draft.pricing.mrp ?? "");
  const [price, setPrice] = useState(draft.pricing.price ?? "");
  const [passFees, setPassFees] = useState(draft.pricing.passFees ?? true);
  const [isAiPreviewOpen, setIsAiPreviewOpen] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const handleGenerateAI = () => {
    // Add logic for AI generation here
    alert("AI generation triggered. Connect your API keys in CourseContext or API client.");
  };

  const handleQuit = () => {
    navigate("/courses");
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    updateDraft({
      title,
      description,
      pricing: { planType: planType as "FREE" | "ONE_TIME", mrp, price, passFees },
    });
    
    // Simulate DB save
    setShowToast(true);
    
    // Increased delay to ensure user sees the toast before navigation
    setTimeout(() => {
        navigate("/courses/builder");
    }, 2000);
  };

  return (
    <div className="pt-16 pb-8 min-h-screen px-4 sm:px-6 lg:px-8 bg-white">
      <form id="live-session-create-form" style={{ padding: 0 }} className="flex w-full flex-col gap-6 lg:w-3/4" onSubmit={handleNext}>
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-base font-semibold text-[#0F1013] mb-2 block">
            Title *
          </label>
          <input
            className="border outline-none border-[#C9CED3] focus:border-[#4E5DE0] pl-4 pr-4 py-3.5 w-full text-sm bg-white transition-colors duration-200 text-[#393F41]"
            name="title"
            placeholder="Enter course title"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* AI Banner */}
        <div className="bg-[#F4F6FA] p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 self-start bg-white py-0.5 px-2">
                <Star size={12} className="text-[#152561]" fill="currentColor" />
                <span className="text-xs font-bold text-[#152561]">NEW</span>
              </div>
              <div className="text-sm font-medium text-[#393F41]">
                Let our AI tool work its magic to generate a compelling course description and other metadata in seconds!
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAI}
              className="relative inline-flex items-center gap-2 bg-white border border-neutral-200 font-semibold whitespace-nowrap shadow-sm transition-all hover:shadow hover:border-neutral-300 px-4 h-10 text-sm"
            >
              <Wand2 size={17} className="text-neutral-500" />
              <span className="text-neutral-900 font-medium">Generate using AI</span>
            </button>
          </div>
        </div>

        {/* Description Editor */}
        <div>
          <label htmlFor="sessionDescription" className="text-base font-semibold text-[#0F1013] mb-2 block">
            Description *
          </label>
          <MarkdownEditor
            value={description}
            onChange={setDescription}
            minHeight={200}
            placeholder="Write your course description in Markdown..."
          />
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-5">
          <label className="text-base font-semibold text-[#0F1013] block">Set pricing</label>

          {/* Free plan */}
          <div className="bg-[#F4F6FA] p-5 flex gap-5 ">
            <div className="w-8 h-8 flex justify-center items-center flex-shrink-0">
              <label className="cursor-pointer items-center flex m-0">
                <input
                  type="radio"
                  name="planType"
                  value="FREE"
                  checked={planType === "FREE"}
                  onChange={() => setPlanType("FREE")}
                  className="hidden"
                />
                <div className="h-3 w-3 border flex items-center justify-center m-0 border-[#393F41]">
                  {planType === "FREE" && <div className="bg-[#393F41] h-[6px] w-[6px] " />}
                </div>
              </label>
            </div>
            <label className="block cursor-pointer w-full" htmlFor="planType-FREE">
              <div>
                <p className="text-sm font-semibold text-[#393F41]">Free plan</p>
              </div>
              <p className="text-xs font-normal text-[#6B7280]">Allow unrestricted access to your content free of cost</p>
            </label>
          </div>

          {/* One-time plan */}
          <div className="bg-[#F4F6FA] p-5 flex gap-5 ">
            <div className="w-8 h-8 flex justify-center items-center flex-shrink-0">
              <label className="cursor-pointer items-center flex m-0">
                <input
                  type="radio"
                  name="planType"
                  value="ONE_TIME"
                  checked={planType === "ONE_TIME"}
                  onChange={() => setPlanType("ONE_TIME")}
                  className="hidden"
                />
                <div className="h-3 w-3 border flex items-center justify-center m-0 border-[#4E5DE0]">
                  {planType === "ONE_TIME" && <div className="bg-[#4E5DE0] h-[6px] w-[6px] " />}
                </div>
              </label>
            </div>
            <label className="block cursor-pointer w-full" htmlFor="planType-ONE_TIME">
              <div>
                <p className="text-sm font-semibold text-[#393F41]">One-time plan</p>
              </div>
              <p className="text-xs font-normal text-[#6B7280]">Allow full course access with a single payment</p>

              {planType === "ONE_TIME" && (
                <>
                  <div className="flex gap-5 mt-5">
                    <div className="w-1/2">
                      <label className="text-sm font-medium text-[#0F1013] mb-2 block" htmlFor="mrp">
                        Total price *
                      </label>
                      <div className="flex items-center justify-center border border-[#C9CED3] focus-within:border-[#4E5DE0] bg-white overflow-hidden">
                        <div className="flex items-center justify-center self-stretch border-r border-[#C9CED3] bg-[#F4F6FA]">
                          <div className="px-3 text-sm">₹</div>
                        </div>
                        <input
                          className="border outline-none border-transparent pl-4 pr-4 py-3.5 w-full text-sm bg-white"
                          name="mrp"
                          type="number"
                          placeholder="Enter price"
                          value={mrp}
                          onChange={(e) => setMrp(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <label className="text-sm font-medium text-[#0F1013] mb-2 block" htmlFor="price">
                        Discount Amount {mrp && Number(mrp) > 0 && Number(price) > 0 ? `(${Math.round((Number(price) / Number(mrp)) * 100)}% off)` : "(0% off)"}*
                      </label>
                      <div className="flex items-center justify-center border border-[#C9CED3] focus-within:border-[#4E5DE0] bg-white overflow-hidden">
                        <div className="flex items-center justify-center self-stretch border-r border-[#C9CED3] bg-[#F4F6FA]">
                          <div className="px-3 text-sm">₹</div>
                        </div>
                        <input
                          className="border outline-none border-transparent pl-4 pr-4 py-3.5 w-full text-sm bg-white"
                          name="price"
                          type="number"
                          placeholder="Enter discount amount"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-indigo-50 ">
                    <p className="text-sm font-semibold text-indigo-900">
                      Final Price: ₹ {Math.max(0, Number(mrp) - Number(price)).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center cursor-pointer gap-3 mt-5">
                      <input
                        type="checkbox"
                        checked={passFees}
                        onChange={(e) => setPassFees(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 flex items-center justify-center border ${
                          passFees ? "bg-[#4E5DE0] border-[#4E5DE0]" : "bg-white border-[#C9CED3]"
                        }`}
                      >
                        {passFees && (
                          <svg width="10" height="10" viewBox="0 0 448 512" className="text-white">
                            <path
                              fill="currentColor"
                              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-[#393F41]">
                        Pass internet handling fees (PG fees) to learners (₹0)
                      </span>
                    </label>
                    <Info size={14} className="text-[#393F41] ml-2 mb-5" />
                  </div>
                </>
              )}
            </label>
          </div>

          <div className="flex items-start gap-3 px-4 py-2 bg-[#F4F6FA] ">
            <Lightbulb size={16} className="text-[#152561] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#0F1013]">
              You can add multiple pricing options and access advanced plans later under course pricing.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#ECEEEF] pt-6">
          <button
            type="button"
            onClick={() => setShowQuitModal(true)}
            className="inline-flex items-center gap-2 border border-[#C9CED3] bg-white px-5 h-10 text-sm font-semibold text-[#393F41] hover:bg-[#F7F9FA]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="newCourseSubmitBtn inline-flex items-center gap-2 bg-[#4E5DE0] px-6 h-10 text-sm font-semibold text-white hover:bg-[#4350C8]"
          >
            Next
          </button>
        </div>
      </form>

      {showToast && <Toast message="Course saved successfully!" onClose={() => setShowToast(false)} />}
      
      {/* QUIT MODAL */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white shadow-xl overflow-hidden">
            <div className="sticky top-0 flex items-center p-4 border-b border-[#ECEEEF] bg-white">
              <div className="flex-grow">
                <h4 className="text-base text-[#393F41] font-semibold">Do you want to quit creating a course?</h4>
              </div>
              <div className="ml-auto bg-[#F4F6FA] px-3 py-2">
                <X size={14} className="cursor-pointer text-[#393F41]" onClick={() => setShowQuitModal(false)} />
              </div>
            </div>
            <div className="px-12 py-6">
              <p className="text-sm text-[#393F41]">
                If you leave this page without creating your course, your current progress will be lost.
              </p>
            </div>
            <div className="sticky bottom-0 w-full bg-white left-0 flex items-end justify-end p-4">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setShowQuitModal(false)}
                  className="w-[100px] mr-4 whitespace-nowrap border border-[#C9CED3] bg-white px-4 h-10 text-sm font-semibold text-[#393F41]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleQuit}
                  className="w-[160px] whitespace-nowrap bg-[#4E5DE0] px-4 h-10 text-sm font-semibold text-white"
                >
                  Continue creating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI GENERATED CONTENT PREVIEW MODAL */}
      {isAiPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[600px] bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center p-5 shadow-sm bg-white">
              <div className="flex-grow">
                <div className="text-base text-[#393F41] font-semibold">AI generated content preview</div>
              </div>
              <div className="cursor-pointer" onClick={() => setIsAiPreviewOpen(false)}>
                <X size={18} className="text-[#393F41]" />
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 overflow-auto">
              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-[#0F1013] font-semibold">
                  Description
                  <RefreshCw size={18} className="text-[#152561] cursor-pointer" />
                </div>
                <textarea
                  className="w-full resize-none outline-none border border-[#ECEEEF] p-3 text-sm text-[#393F41] min-h-[80px]"
                  rows={3}
                  placeholder="AI generated description..."
                />
              </div>

              {/* Tagline */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-[#0F1013] font-semibold">
                  Tagline <RefreshCw size={18} className="text-[#152561] cursor-pointer" />
                </div>
                <textarea
                  className="w-full resize-none outline-none border border-[#ECEEEF] p-3 text-sm text-[#393F41] min-h-[60px]"
                  rows={2}
                  placeholder="AI generated tagline..."
                />
              </div>

              {/* Key highlights */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-[#0F1013] font-semibold">
                  Key highlights <RefreshCw size={18} className="text-[#152561] cursor-pointer" />
                </div>
                <textarea
                  className="w-full resize-none outline-none border border-[#ECEEEF] p-3 text-sm text-[#393F41] min-h-[60px]"
                  rows={2}
                  placeholder="AI generated key highlights..."
                />
              </div>

              {/* What you will learn */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-[#0F1013] font-semibold">
                  What you will learn <RefreshCw size={18} className="text-[#152561] cursor-pointer" />
                </div>
                <textarea
                  className="w-full resize-none outline-none border border-[#ECEEEF] p-3 text-sm text-[#393F41] min-h-[60px]"
                  rows={2}
                  placeholder="AI generated learning outcomes..."
                />
              </div>

              {/* Meta description */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-[#0F1013] font-semibold">
                  Meta description <RefreshCw size={18} className="text-[#152561] cursor-pointer" />
                </div>
                <textarea
                  className="w-full resize-none outline-none border border-[#ECEEEF] p-3 text-sm text-[#393F41] min-h-[60px]"
                  rows={2}
                  placeholder="AI generated meta description..."
                />
              </div>

              {/* Meta keywords */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-[#0F1013] font-semibold">
                  Meta keywords <RefreshCw size={18} className="text-[#152561] cursor-pointer" />
                </div>
                <input
                  type="text"
                  className="w-full outline-none border border-[#ECEEEF] px-3 py-2 text-sm text-[#393F41]"
                  placeholder="Enter keywords..."
                />
              </div>
            </div>

            <div className="bg-[#F4F6FA] text-xs px-6 py-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-[#3C4852]" />
              <span>You can also update this later in course details page</span>
            </div>

            <div className="w-full bg-white left-0 flex items-end justify-end p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <button className="flex items-center text-[#393F41] text-sm font-semibold px-4 py-2.5" type="button" onClick={() => setIsAiPreviewOpen(false)}>
                  Cancel
                </button>
                <button
                  className="relative inline-flex items-center gap-2 bg-white border border-[#ECEEEF] font-semibold whitespace-nowrap shadow-sm px-4 h-10 text-sm"
                  type="button"
                  onClick={() => setIsAiPreviewOpen(false)}
                >
                  <Wand2 size={17} />
                  <span
                    className="bg-clip-text text-transparent font-semibold"
                    style={{
                      backgroundImage:
                        "linear-gradient(92deg, #37BEC9 0%, #F5B265 32%, #F27CA6 64%, #8E7BF5 100%)",
                    }}
                  >
                    Apply changes
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}