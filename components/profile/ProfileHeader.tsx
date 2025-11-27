"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Briefcase, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type UserProfile = {
  name: string;
  title: string;
  location: string;
  avatar: string;
};

export function ProfileHeader() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id || "";
  const user = session.data?.user;
  const isSessionLoading = session.isPending;

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "John Doe",
    title: "Software Engineer",
    location: "Location not set",
    avatar: user?.image || "/default-avatar.png",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile from backend
  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-profile?userId=${userId}`
        );
        if (!res.ok) return;

        const data = await res.json();
        if (data.profile) {
          const p = data.profile;
          const locationParts = [p.city, p.state, p.country].filter(Boolean);
          setProfile((prev) => ({
            ...prev,
            name: p.fullName || user?.name || prev.name,
            title: p.jobTitle || prev.title,
            location: locationParts.join(", ") || prev.location,
            avatar: p.profileImage || user?.image || prev.avatar,
          }));
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }

    fetchProfile();
  }, [userId, user]);

  // Keep basic fields in sync with session
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        avatar: user.image || prev.avatar,
      }));
    }
  }, [user]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload-profile-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        console.error("Upload failed:", res.status, msg);
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setProfile((prev) => ({
        ...prev,
        avatar: data.url || prev.avatar,
      }));
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
        Please sign in to view your profile.
      </div>
    );
  }


  return (
    <div className="relative w-full rounded-xl border border-gray-100 bg-white p-6 pt-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start gap-8 w-full">
        {/* Left side - Avatar and photo button */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-blue-100 bg-blue-50/40 shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
          <Image
            src={profile.avatar || "/default-avatar.png"}
            alt={profile.name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        <button
          onClick={triggerFileInput}
          disabled={isUploading}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${
            isUploading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700"
          } transition-colors`}
          title="Change profile picture"
        >
          {isUploading ? (
            <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
          <span>Change photo</span>
        </button>
      </div>

      {/* Right side - Profile info */}
      <div className="flex-1 w-full pt-1">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold pt-6 text-gray-900">{profile.name}</h1>
              {profile.title && (
                <p className="text-gray-600 pt-1 font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4 flex-shrink-0" />
                  <span>{profile.title}</span>
                </p>
              )}
              {profile.location && (
                <p className="text-blue-600 text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{profile.location}</span>
                </p>
              )}
            </div>

          </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 text-center md:text-left">{error}</p>
      )}
    </div>
    </div>
  );
}
