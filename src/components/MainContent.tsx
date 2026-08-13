import { ArrowRight, Sparkles, Clock } from "lucide-react";

export function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8 space-y-12">
      {/* SECTION 1: IN THE LAST 30 DAYS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">In the last 30 days</h2>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-900 hover:underline">
            View Reports <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Card 1: Sign Ups */}
          <div className="relative border border-gray-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span className="font-medium text-gray-700">Sign Ups</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock size={12} /> 37 secs ago
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mt-1">1</div>
            </div>
            <div className="mt-6">
              <svg className="w-full h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 25 L30 25 L50 15 L70 20 L100 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Card 2: Paid Users */}
          <div className="border border-gray-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span className="font-medium text-gray-700">Paid Users</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock size={12} /> 37 secs ago
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mt-1">0</div>
            </div>
            <div className="h-8 mt-6"></div>
          </div>

          {/* Card 3: Total Revenue */}
          <div className="border border-gray-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span className="font-medium text-gray-700">Total Revenue</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock size={12} /> 37 secs ago
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mt-1">₹0</div>
            </div>
            <div className="h-8 mt-6"></div>
          </div>

          {/* Card 4: Graphy Assist AI */}
          <div className="border border-gray-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 text-indigo-600 bg-indigo-50 p-1.5 ">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mt-1">--</div>
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              of your total revenue comes via Graphy Assist. Learn more <a href="#" className="text-indigo-600 font-semibold hover:underline">Learn more</a>
            </p>
          </div>
        </div>
      </section>

      {/* EARNINGS BANNER 1 */}
      <div className="bg-gradient-to-r from-[#fef3c7] via-[#fde68a]/50 to-[#fef3c7] p-8 border border-amber-200/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-900">Get your earnings right away</h3>
          <p className="text-sm text-gray-700 mt-1">Enabling your payments are a MUST to collect revenue!</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-950 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-900 transition-colors shrink-0">
          Instantly connect a payment gateway <ArrowRight size={16} />
        </button>
      </div>

      {/* SECTION 2: WEBINAR */}
      <div className="space-y-6 pt-4">
        <h3 className="text-center font-serif italic text-xl text-gray-700">Host your first webinar</h3>

        <div className="bg-[#e6f4ea] overflow-hidden border border-emerald-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 md:p-10 space-y-4">
            <h4 className="text-3xl font-bold text-gray-900 tracking-tight">Capture your best leads with webinars</h4>
            <p className="text-sm text-gray-700 leading-relaxed max-w-xl">
              1 Webinar: an opportunity to host hundreds of audience members! Yes, a trusted in-house lead generator is now at your fingertips.
            </p>
            <div className="pt-2">
              <button className="inline-flex items-center gap-2 bg-indigo-950 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-900 transition-colors">
                Host your first webinar <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 p-6 flex justify-center items-center bg-[#cce8d6]/40 h-full min-h-[220px]">
            {/* Illustration placeholder */}
            <div className="relative w-full max-w-xs bg-white shadow-md p-4 border border-emerald-200">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div className="w-3 h-3 bg-red-400"></div>
                <div className="w-3 h-3 bg-amber-400"></div>
                <div className="w-3 h-3 bg-emerald-400"></div>
              </div>
              <div className="py-6 text-center text-emerald-800 font-medium text-sm">
                Webinar Studio Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: COURSE */}
      <div className="space-y-6 pt-4">
        <h3 className="text-center font-serif italic text-xl text-gray-700">Launch your first course</h3>

        <div className="bg-[#eef2ff] overflow-hidden border border-indigo-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 p-6 flex justify-center items-center bg-[#e0e7ff]/50 h-full min-h-[220px]">
            <div className="relative w-full max-w-xs bg-white shadow-md p-6 border border-indigo-200 text-center">
              <span className="text-4xl">🌐</span>
              <p className="text-xs font-semibold text-indigo-900 mt-2">Course Studio & Curriculum</p>
            </div>
          </div>
          <div className="lg:col-span-7 p-8 md:p-10 space-y-4">
            <h4 className="text-3xl font-bold text-gray-900 tracking-tight">Why not generate buzz about 'hi'?</h4>
            <p className="text-sm text-gray-700 leading-relaxed max-w-xl">
              No launch is complete without a good shout out. Share on channels like Instagram, Twitter, and Telegram right away.
            </p>
            <div className="pt-2">
              <button className="inline-flex items-center gap-2 bg-indigo-950 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-900 transition-colors">
                Share your new course on social media <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* TWO PROMO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h5 className="text-xl font-bold text-gray-900">Create offers that are impossible to refuse</h5>
            </div>
            <div className="pt-8">
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-950 hover:underline">
                Make promo codes <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h5 className="text-xl font-bold text-gray-900">Your community is going to be so excited about this!</h5>
            </div>
            <div className="pt-8">
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-950 hover:underline">
                Message your community right away <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: FINAL LAP */}
      <div className="space-y-6 pt-6">
        <h3 className="text-center font-serif italic text-xl text-gray-700">Finish your final lap...</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-2xl font-serif font-bold text-gray-900">Get your earnings right away</h4>
              <p className="text-sm text-gray-600 mt-2">Enabling your payments are a MUST to collect revenue!</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-indigo-950 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-900 transition-colors w-fit">
              Instantly connect a payment gateway <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-white p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-2xl font-serif font-bold text-gray-900">Invite your community to a place you own</h4>
              <p className="text-sm text-gray-600 mt-2">There's no limit to the number of members you can invite!</p>
            </div>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-950 hover:underline w-fit pt-2">
              Import to your Graphy <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}