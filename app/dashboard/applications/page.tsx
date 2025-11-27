"use client";

import React, { useState } from "react";
import { 
  FileText, 
  ExternalLink, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal, 
  Pencil, 
  X,
  Save,
  Briefcase
} from "lucide-react";

// --- Types ---
type Status = "Draft" | "Submitted" | "Interview" | "Rejected";

interface Resume {
  id: string;
  name: string;
  url: string;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: Status;
  lastEdited?: string; // For drafts
  appliedOn?: string; // For submitted
  jobUrl: string;
  coverLetter: string;
  resumeId: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

// --- Mock Data ---
const MOCK_RESUMES: Resume[] = [
  { id: "r1", name: "Full Stack Dev Resume v2.pdf", url: "#" },
  { id: "r2", name: "Frontend Focused Resume.pdf", url: "#" },
];

const INITIAL_DRAFTS: Application[] = [
  {
    id: "d1",
    jobTitle: "Senior React Developer",
    company: "TechFlow Inc.",
    status: "Draft",
    lastEdited: "2 mins ago",
    jobUrl: "https://example.com/job/1",
    coverLetter: "Dear Hiring Manager,\n\nI am writing to express my interest...",
    resumeId: "r1",
    contactInfo: { name: "Alex Dev", email: "alex@example.com", phone: "+91 98765 43210" },
  },
  {
    id: "d2",
    jobTitle: "Frontend Engineer",
    company: "Creativv Studios",
    status: "Draft",
    lastEdited: "2 days ago",
    jobUrl: "https://example.com/job/2",
    coverLetter: "To the Creativv Team,\n\nI've been following your work...",
    resumeId: "r2",
    contactInfo: { name: "Alex Dev", email: "alex@example.com", phone: "+91 98765 43210" },
  },
];

const INITIAL_SUBMITTED: Application[] = [
  {
    id: "s1",
    jobTitle: "Full Stack Engineer",
    company: "Global Systems",
    status: "Submitted",
    appliedOn: "Nov 24, 2025",
    jobUrl: "https://example.com/job/3",
    coverLetter: "",
    resumeId: "r1",
    contactInfo: { name: "Alex Dev", email: "alex@example.com", phone: "" },
  },
  {
    id: "s2",
    jobTitle: "Backend Developer (Node.js)",
    company: "Serverless Co.",
    status: "Interview",
    appliedOn: "Nov 20, 2025",
    jobUrl: "https://example.com/job/4",
    coverLetter: "",
    resumeId: "r1",
    contactInfo: { name: "Alex Dev", email: "alex@example.com", phone: "" },
  },
];

export default function ApplicationDraftsPage() {
  const [activeTab, setActiveTab] = useState<"drafts" | "submitted">("drafts");
  const [drafts, setDrafts] = useState<Application[]>(INITIAL_DRAFTS);
  const [submitted, setSubmitted] = useState<Application[]>(INITIAL_SUBMITTED);
  const [selectedDraft, setSelectedDraft] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // --- Actions ---

  const handleOpenDraft = (draft: Application) => {
    setSelectedDraft(draft);
    setIsModalOpen(true);
  };

  const handleDeleteDraft = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleMarkAsSubmitted = () => {
    if (!selectedDraft) return;

    // Move from drafts to submitted
    const newSubmitted = {
      ...selectedDraft,
      status: "Submitted" as Status,
      appliedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setSubmitted((prev) => [newSubmitted, ...prev]);
    setDrafts((prev) => prev.filter((d) => d.id !== selectedDraft.id));
    
    setIsModalOpen(false);
    triggerToast();
  };

  const handleSaveDraft = () => {
    if (!selectedDraft) return;
    
    setDrafts((prev) => prev.map(d => d.id === selectedDraft.id ? selectedDraft : d));
    triggerToast("Draft saved successfully");
  };

  const triggerToast = (msg = "Application marked as submitted!") => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Application Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your ongoing drafts and track submitted applications.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab("drafts")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === "drafts"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Drafts ({drafts.length})
        </button>
        <button
          onClick={() => setActiveTab("submitted")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === "submitted"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Submitted ({submitted.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* DRAFTS TABLE */}
        {activeTab === "drafts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Edited</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drafts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      No active drafts. Start applying to jobs!
                    </td>
                  </tr>
                ) : (
                  drafts.map((draft) => (
                    <tr key={draft.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{draft.jobTitle}</div>
                        <div className="text-sm text-gray-500">{draft.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          {draft.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {draft.lastEdited}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenDraft(draft)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBMITTED TABLE */}
        {activeTab === "submitted" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submitted.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{app.jobTitle}</div>
                      <div className="text-sm text-gray-500">{app.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        app.status === 'Interview' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.appliedOn}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={app.jobUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-400 hover:text-blue-600 inline-block transition-colors"
                        title="View Job Posting"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DRAFT DETAIL MODAL (Slide-over style) */}
      {isModalOpen && selectedDraft && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm transition-all">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedDraft.jobTitle}</h2>
                <p className="text-sm text-gray-500">{selectedDraft.company}</p>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={handleSaveDraft}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                  title="Save Changes"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Section: Job Info */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" /> Job Details
                  </h3>
                  <a 
                    href={selectedDraft.jobUrl}
                    target="_blank"
                    rel="noreferrer" 
                    className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Open original job page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </section>

              {/* Section: Resume Selection */}
              <section className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Resume used</label>
                <select 
                  value={selectedDraft.resumeId}
                  onChange={(e) => setSelectedDraft({...selectedDraft, resumeId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {MOCK_RESUMES.map(resume => (
                    <option key={resume.id} value={resume.id}>{resume.name}</option>
                  ))}
                </select>
              </section>

              {/* Section: Prefilled Info */}
              <section className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Full Name</label>
                  <input 
                    type="text" 
                    value={selectedDraft.contactInfo.name}
                    onChange={(e) => setSelectedDraft({
                      ...selectedDraft, 
                      contactInfo: {...selectedDraft.contactInfo, name: e.target.value}
                    })}
                    className="w-full border-b border-gray-300 pb-1 text-sm focus:border-blue-500 outline-none bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Email</label>
                  <input 
                    type="email" 
                    value={selectedDraft.contactInfo.email}
                    onChange={(e) => setSelectedDraft({
                      ...selectedDraft, 
                      contactInfo: {...selectedDraft.contactInfo, email: e.target.value}
                    })}
                    className="w-full border-b border-gray-300 pb-1 text-sm focus:border-blue-500 outline-none bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Phone</label>
                  <input 
                    type="tel" 
                    value={selectedDraft.contactInfo.phone}
                    onChange={(e) => setSelectedDraft({
                      ...selectedDraft, 
                      contactInfo: {...selectedDraft.contactInfo, phone: e.target.value}
                    })}
                    className="w-full border-b border-gray-300 pb-1 text-sm focus:border-blue-500 outline-none bg-transparent"
                  />
                </div>
              </section>

              {/* Section: Cover Letter */}
              <section className="space-y-3 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                  <span className="text-xs text-gray-400">Markdown supported</span>
                </div>
                <textarea 
                  value={selectedDraft.coverLetter}
                  onChange={(e) => setSelectedDraft({...selectedDraft, coverLetter: e.target.value})}
                  className="w-full flex-1 min-h-[200px] border border-gray-300 rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none leading-relaxed"
                  placeholder="Write your cover letter here..."
                />
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Last saved: <span className="font-medium">{selectedDraft.lastEdited || 'Just now'}</span>
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleMarkAsSubmitted}
                  className="px-5 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-200"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark as Submitted
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom duration-300 z-50">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Status updated successfully</span>
        </div>
      )}

    </div>
  );
}
