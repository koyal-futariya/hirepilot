// components/HomePage/FAQ.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does HirePilot apply to jobs for me?",
    answer:
      "After you set your preferences and upload your resume, HirePilot uses AI to find matching jobs and automatically submits applications on your behalf—no manual forms required.",
  },
  {
    question: "Do I need to provide my resume?",
    answer:
      "Yes, uploading your resume helps us auto-fill applications and improves the quality of job matches.",
  },
  {
    question: "Is my data safe and private?",
    answer:
      "Absolutely! We use secure encryption and never share your information without your permission. You control your data at all times.",
  },
  {
    question: "Can HirePilot apply to jobs on LinkedIn, Indeed, and others?",
    answer:
      "Yes, HirePilot supports auto-applying to jobs posted on leading platforms including LinkedIn and Indeed. We're adding more all the time!",
  },
  {
    question: "Does HirePilot guarantee a job offer?",
    answer:
      "We can't guarantee offers, but we maximize your application reach and help you get interviews faster by automating the process.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<null | number>(null);

  return (
    <section className="bg-[#F9FAFC] py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq.question}
              className="bg-white rounded-xl shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center px-6 py-5 text-left text-lg font-medium text-gray-800 focus:outline-none transition"
                onClick={() => setOpenIndex(idx === openIndex ? null : idx)}
                aria-expanded={openIndex === idx}
              >
                {faq.question}
                <ChevronDown
                  className={`w-6 h-6 ml-3 transition-transform ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5 text-gray-600 text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
