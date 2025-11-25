// components/HomePage/HowItWorks.tsx

import { Briefcase, UserPlus, Sparkles, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
          How <span className="text-[#FCC419]">HirePilot</span> Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <UserPlus className="w-11 h-11 mb-4 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Sign Up</h3>
            <p className="text-gray-500">Create your account and set up your profile in minutes.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Briefcase className="w-11 h-11 mb-4 text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Add Resume & Details</h3>
            <p className="text-gray-500">Upload your resume and set your career preferences.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Sparkles className="w-11 h-11 mb-4 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">3. AI Auto-Apply</h3>
            <p className="text-gray-500">Let HirePilot find and apply to the best jobs for you.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="w-11 h-11 mb-4 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Track & Succeed</h3>
            <p className="text-gray-500">Track job progress and celebrate your job offer!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
