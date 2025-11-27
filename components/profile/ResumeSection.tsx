"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  TrashIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

interface Resume {
  id: string;
  name: string;
  url: string;
  size: number;
  lastModified: number;
  isUploaded: boolean;
  file?: File;
}

// Type guard
function hasFile(resume: Resume | null): resume is Resume & { file: File } {
  return !!resume && "file" in resume && resume.file !== undefined;
}

export function ResumeSection() {
  const session = authClient.useSession();
  const currentUserId = session.data?.user?.id || "";
  const isSessionLoading = session.isPending;

  const [resume, setResume] = useState<Resume | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Fetch resume from profile
  useEffect(() => {
    if (!currentUserId || !API_BASE) return;

    const fetchResume = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/get-profile?userId=${currentUserId}`
        );
        if (!response.ok) return;

        const data = await response.json();
        if (data.profile?.resumeUrl) {
          const resumeData: Resume = {
            id: "resume-" + currentUserId,
            name:
              data.profile.resumeUrl.split("/").pop() || "resume.pdf",
            url: data.profile.resumeUrl,
            size: 0,
            lastModified: Date.now(),
            isUploaded: true,
          };

          setResume(resumeData);

          if (
            data.profile.resumeUrl.toLowerCase().endsWith(".pdf")
          ) {
            setPreviewUrl(data.profile.resumeUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, [currentUserId, API_BASE]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    const newResume: Resume = {
      id: Date.now().toString(),
      name: file.name,
      url: fileUrl,
      size: file.size,
      lastModified: file.lastModified,
      file,
      isUploaded: false,
    };
    setResume(newResume);

    setPreviewUrl(
      file.type === "application/pdf" ? fileUrl : null
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!resume?.file || !API_BASE) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume.file);
      formData.append("userId", currentUserId);

      const uploadResponse = await fetch(
        `${API_BASE}/api/upload-resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse
          .json()
          .catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const uploadData = await uploadResponse.json();

      // Persist resumeUrl on profile
      const profileResponse = await fetch(
        `${API_BASE}/api/save-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            resumeUrl: uploadData.url,
          }),
        }
      );

      if (!profileResponse.ok) {
        const errorData = await profileResponse
          .json()
          .catch(() => ({}));
        throw new Error(errorData.error || "Failed to update profile");
      }

      setResume((prev) =>
        prev
          ? {
              ...prev,
              url: uploadData.url,
              isUploaded: true,
              file: undefined,
              name: uploadData.filename || "resume.pdf",
            }
          : null
      );

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload resume";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume || !API_BASE) return;
    if (
      !window.confirm(
        "Are you sure you want to delete your resume?"
      )
    )
      return;

    try {
      // Clear resumeUrl from profile
      const response = await fetch(
        `${API_BASE}/api/save-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            resumeUrl: null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Inform backend to delete from Blob (optional implementation)
      const deleteResponse = await fetch(
        `${API_BASE}/api/delete-resume`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: resume.name,
            userId: currentUserId,
          }),
        }
      );

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse
          .json()
          .catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete file");
      }

      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setResume(null);
      setPreviewUrl(null);
      alert("Resume deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error";
      alert(`Error deleting resume: ${errorMessage}`);
    }
  };

  const handleDownload = () => {
    if (!resume) return;
    const link = document.createElement("a");
    link.href = resume.url;
    link.download = resume.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isSessionLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Resume</h3>
        {hasFile(resume) && !isUploading && (
          <button
            onClick={handleUpload}
            className="mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Resume
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {resume ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {resume.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(resume.size)} • Updated{" "}
                    {formatDate(resume.lastModified)}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-4 sm:mt-0">
                {resume.url
                  .toLowerCase()
                  .endsWith(".pdf") && (
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View PDF
                  </a>
                )}
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Download
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-red-200 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mt-2 flex justify-center text-sm text-gray-600">
              <div className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer"
                >
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1">Upload a file</p>
                  <p className="text-xs text-gray-500">
                    PDF or Word document (max 5MB)
                  </p>
                </label>
                <input
                  id="resume-upload"
                  name="resume-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                />
              </div>
            </div>
            {isUploading && (
              <div className="mt-4 text-sm text-gray-600">
                Uploading...
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
