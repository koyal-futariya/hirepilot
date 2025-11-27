"use client";

import { useState, useEffect } from "react";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { authClient } from "@/lib/auth-client";

interface InfoItem {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
}

const initialInfo: InfoItem[] = [
  { label: "Full Name", value: "", required: true },
  { label: "Gender", value: "" },
  { label: "Date of Birth", value: "", type: "date" },
  { label: "Phone", value: "", type: "tel" },
  { label: "Email", value: "", type: "email", required: true },
  { label: "Address", value: "" },
  { label: "Permanent Address", value: "" },
  { label: "City", value: "" },
  { label: "State", value: "" },
  { label: "Country", value: "" },
  { label: "ZIP Code", value: "" },
  { label: "Job Title", value: "" },
  { label: "Department", value: "" },
  { label: "Company", value: "" },
];

export function InfoSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [personalInfo, setPersonalInfo] = useState<InfoItem[]>(initialInfo);
  const [editableInfo, setEditableInfo] = useState<InfoItem[]>(initialInfo);
  const [editableAbout, setEditableAbout] = useState("");
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const session = authClient.useSession();
  const userId = session.data?.user?.id || "";
  const isSessionLoading = session.isPending;

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-profile?userId=${userId}`
      );
      if (!res.ok) return;

      const data = await res.json();
      if (data.profile) {
        setAbout(data.profile.summary || "");
        setEditableAbout(data.profile.summary || "");
        setEducation(data.profile.education ?? []);
        setExperience(data.profile.experience ?? []);
        setSkills(data.profile.skills ?? []);

        const newInfo: InfoItem[] = initialInfo.map((item) => {
          switch (item.label) {
            case "Full Name":
              return { ...item, value: data.profile.fullName || "" };
            case "Gender":
              return { ...item, value: data.profile.gender || "" };
            case "Date of Birth":
              return {
                ...item,
                value: data.profile.dateOfBirth
                  ? data.profile.dateOfBirth.substring(0, 10)
                  : "",
              };
            case "Phone":
              return { ...item, value: data.profile.phone || "" };
            case "Email":
              return { ...item, value: data.profile.email || "" };
            case "Address":
              return {
                ...item,
                value: data.profile.address?.current || "",
              };
            case "Permanent Address":
              return {
                ...item,
                value: data.profile.address?.permanent || "",
              };
            case "City":
              return { ...item, value: data.profile.city || "" };
            case "State":
              return { ...item, value: data.profile.state || "" };
            case "Country":
              return { ...item, value: data.profile.country || "" };
            case "ZIP Code":
              return { ...item, value: data.profile.zipCode || "" };
            case "Job Title":
              return { ...item, value: data.profile.jobTitle || "" };
            case "Department":
              return { ...item, value: data.profile.department || "" };
            case "Company":
              return { ...item, value: data.profile.company || "" };
            default:
              return item;
          }
        });

        setPersonalInfo(newInfo);
        setEditableInfo(newInfo);
      }
    }

    fetchProfile();
  }, [userId]);

  const handleInputChange = (index: number, value: string) => {
    const updatedInfo = [...editableInfo];
    updatedInfo[index] = { ...updatedInfo[index], value };
    setEditableInfo(updatedInfo);
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/save-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            about: editableAbout,
            personalInfo: editableInfo,
            education,
            experience,
            skills,
          }),
        }
      );

      if (!res.ok) {
        const errMessage = await res.text();
        console.error("Failed to save profile:", res.status, errMessage);
        return;
      }

      setPersonalInfo([...editableInfo]);
      setAbout(editableAbout);
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleCancel = () => {
    setEditableInfo([...personalInfo]);
    setEditableAbout(about);
    setIsEditing(false);
  };

  if (isSessionLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personal Info Card */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Basic details used across your profile and applications.
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700 hover:shadow transition-colors"
            >
              <PencilIcon className="mr-1.5 h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <XMarkIcon className="mr-1.5 h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <CheckIcon className="mr-1.5 h-4 w-4" />
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {editableInfo.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <label className="flex items-center text-xs font-medium text-gray-600">
                {item.label}
                {item.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>
              {isEditing ? (
                <input
                  type={item.type || "text"}
                  value={item.value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required={item.required}
                  placeholder={
                    item.label === "Full Name"
                      ? "Enter your full name"
                      : undefined
                  }
                />
              ) : (
                <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  {item.value || (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About Card */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
            <p className="mt-1 text-xs text-gray-500">
              Share a brief summary about your experience and goals.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700 hover:shadow transition-colors"
            >
              <PencilIcon className="mr-1.5 h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <textarea
            value={editableAbout}
            onChange={(e) => setEditableAbout(e.target.value)}
            className="mt-1 w-full min-h-[140px] rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Write a short introduction, your current role, and what you're looking for..."
          />
        ) : (
          <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
            {about || (
              <span className="text-gray-400">
                Add a short summary so others can get to know you better.
              </span>
            )}
          </p>
        )}
      </section>
    </div>
  );
}
