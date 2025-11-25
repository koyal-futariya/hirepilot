'use client';

import { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { authClient } from '@/lib/auth-client';

interface InfoItem {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
}

const initialInfo: InfoItem[] = [
  { label: 'Full Name', value: '', required: true },
  { label: 'Gender', value: '' },
  { label: 'Date of Birth', value: '', type: 'date' },
  { label: 'Phone', value: '', type: 'tel' },
  { label: 'Email', value: '', type: 'email', required: true },
  { label: 'Address', value: '' },
  { label: 'Permanent Address', value: '' },
  { label: 'City', value: '' },
  { label: 'State', value: '' },
  { label: 'Country', value: '' },
  { label: 'ZIP Code', value: '' },
  { label: 'Job Title', value: '' },
  { label: 'Department', value: '' },
  { label: 'Company', value: '' },
];

export function InfoSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState('');
  const [personalInfo, setPersonalInfo] = useState<InfoItem[]>(initialInfo);
  const [editableInfo, setEditableInfo] = useState<InfoItem[]>(initialInfo);
  const [editableAbout, setEditableAbout] = useState('');
  // Additional profile fields for preservation
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  // Get Better Auth session and user info
  const session = authClient.useSession();
  const userId = session.data?.user?.id || '';
  const isSessionLoading = session.isPending;

  // Fetch full profile and preserve all fields
  useEffect(() => {
    if (!userId) return;
    async function fetchProfile() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-profile?userId=${userId}`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.profile) {
        setAbout(data.profile.summary || '');
        setEditableAbout(data.profile.summary || '');
        setEducation(data.profile.education ?? []);
        setExperience(data.profile.experience ?? []);
        setSkills(data.profile.skills ?? []);
        // Map personalInfo from backend to InfoItem[]
        const newInfo: InfoItem[] = initialInfo.map(item => {
          switch (item.label) {
            case 'Full Name': return { ...item, value: data.profile.fullName || '' };
            case 'Gender': return { ...item, value: data.profile.gender || '' };
            case 'Date of Birth': return { ...item, value: data.profile.dateOfBirth ? data.profile.dateOfBirth.substring(0, 10) : '' };
            case 'Phone': return { ...item, value: data.profile.phone || '' };
            case 'Email': return { ...item, value: data.profile.email || '' };
            case 'Address': return { ...item, value: data.profile.address?.current || '' };
            case 'Permanent Address': return { ...item, value: data.profile.address?.permanent || '' };
            case 'City': return { ...item, value: data.profile.city || '' };
            case 'State': return { ...item, value: data.profile.state || '' };
            case 'Country': return { ...item, value: data.profile.country || '' };
            case 'ZIP Code': return { ...item, value: data.profile.zipCode || '' };
            case 'Job Title': return { ...item, value: data.profile.jobTitle || '' };
            case 'Department': return { ...item, value: data.profile.department || '' };
            case 'Company': return { ...item, value: data.profile.company || '' };
            default: return item;
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

  // Always send the latest *unchanged* education, experience, skills fields with your updates!
  const handleSave = async () => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          about: editableAbout,
          personalInfo: editableInfo,
          education,   // preserve unchanged
          experience,  // preserve unchanged
          skills,      // preserve unchanged
        }),
      });
      if (!res.ok) {
        const errMessage = await res.text();
        console.error('Failed to save profile:', res.status, errMessage);
        return;
      }
      setPersonalInfo([...editableInfo]);
      setAbout(editableAbout);
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleCancel = () => {
    setEditableInfo([...personalInfo]);
    setEditableAbout(about);
    setIsEditing(false);
  };

  if (isSessionLoading) {
    return <div>Loading...</div>;
  }
  if (!userId) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold pb-2">Personal Information</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editableInfo.map((item, index) => (
            <div key={index} className="space-y-1">
              <label className="text-sm font-medium text-gray-500">
                {item.label}
                {item.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {isEditing ? (
                <input
                  type={item.type || 'text'}
                  value={item.value}
                  onChange={e => handleInputChange(index, e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={item.required}
                />
              ) : (
                <p className="text-gray-900">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b">About</h3>
        {isEditing ? (
          <textarea
            value={editableAbout}
            onChange={e => setEditableAbout(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-line">{about}</p>
        )}
      </section>
    </div>
  );
}
