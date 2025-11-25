// components/HomePage/Features.tsx

import { Sparkles, Rocket, MousePointerClick, ActivitySquare } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-[#F9FAFC] py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
          Powerful Features to Land Your Next Job
        </h2>
        <div className="grid md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            <Rocket className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Auto-Apply</h3>
            <p className="text-gray-600">
              Auto-fill job forms and submit applications to top jobs in seconds—no manual copying ever again.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
            <MousePointerClick className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">1-Click Bulk Apply</h3>
            <p className="text-gray-600">
              Apply to dozens of jobs with a single click. Your resume and profile sent to every matching opening.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
            <Sparkles className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Job Matches</h3>
            <p className="text-gray-600">
              Personalized AI job recommendations based on your background, goals, and location preferences.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="flex flex-col items-center text-center">
            <ActivitySquare className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Application Tracking</h3>
            <p className="text-gray-600">
              See every application’s status in one dashboard: applied, viewed, interviewed, offer—never miss an update.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
