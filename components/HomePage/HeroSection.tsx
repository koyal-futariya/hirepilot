'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-[#F9FAFC] overflow-hidden pt-20">
      {/* Animated hero blob */}
      <div className="absolute left-[-7rem] top-[-7rem] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-300 via-blue-200 to-white opacity-70 blur-3xl pointer-events-none z-0" />
      <div className="absolute right-[-10rem] bottom-[-7rem] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-blue-100 via-blue-500/20 to-yellow-100 opacity-40 blur-2xl pointer-events-none z-0" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs tracking-wide">
            NEW: AI Auto-Apply Engine
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            Land Jobs Effortlessly <span className="text-[#FCC419]">with HirePilot</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
            1-click applications, autofilled forms, and smart AI tools to <br />
            maximize your job search success—fast, free, and stress-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 shadow-md w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-blue-600 border-blue-200 bg-white text-lg font-bold px-8 py-3">
              How It Works
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span>20,000+ Happy Users</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span>Supports LinkedIn, Indeed, and More</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
