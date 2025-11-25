'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { authClient } from '@/lib/auth-client';

interface EducationItem {
  id: string;
  institute: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export function EducationSection() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  // Local state to preserve other profile fields so backend doesn't overwrite them
  const [personalInfo, setPersonalInfo] = useState<any[]>([]);
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState<Omit<EducationItem, 'id'>>({
    institute: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const session = authClient.useSession();
  const userId = session.data?.user?.id || '';
  const isSessionLoading = session.isPending;

  // Fetch full profile but only store/operate on education locally
  useEffect(() => {
    if (!userId) return;
    async function fetchProfile() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-profile?userId=${userId}`);
        if (!res.ok) {
          console.error('Failed to fetch profile');
          return;
        }
        const data = await res.json();
        setEducations(
          (data.profile?.education ?? []).map((edu: any) => ({
            id: edu.id || `${edu.institute}-${edu.startDate ?? ''}`,
            institute: edu.institute ?? '',
            degree: edu.degree ?? '',
            fieldOfStudy: edu.fieldOfStudy ?? '',
            startDate: edu.startDate ?? '',
            endDate: edu.endDate ?? '',
            description: edu.description ?? '',
          }))
        );
        // Store other fields so we can always send the full profile on save
        setPersonalInfo(data.profile?.personalInfo ?? []);
        setAbout(data.profile?.summary ?? '');
        setExperience(data.profile?.experience ?? []);
        setSkills(data.profile?.skills ?? []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, [userId]);

  const handleInputChange = (id: string, field: keyof EducationItem, value: string) => {
    if (id === 'new') {
      setNewEducation(prev => ({ ...prev, [field]: value }));
    } else {
      setEducations(educations.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu)));
    }
  };

  // Save the entire profile, but only education changes
  const saveProfile = async (updatedEducations: EducationItem[]) => {
    if (!userId) {
      alert('User not authenticated.');
      return false;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          personalInfo,
          about,
          education: updatedEducations, // your changes!
          experience,
          skills,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert('Failed to save education: ' + errText);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Save education error:', error);
      alert('Error saving education.');
      return false;
    }
  };

  const handleAddEducation = async () => {
    const { institute, degree, fieldOfStudy, startDate, endDate } = newEducation;
    if (!institute || !degree || !fieldOfStudy || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }
    const newId = Date.now().toString();
    const updatedEducations = [...educations, { ...newEducation, id: newId }];
    const saved = await saveProfile(updatedEducations);
    if (saved) {
      setEducations(updatedEducations);
      setNewEducation({ institute: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
      setIsAdding(false);
    }
  };

  const handleSaveEducation = async (id: string) => {
    const edu = educations.find(e => e.id === id);
    if (!edu) return;
    if (!edu.institute || !edu.degree || !edu.fieldOfStudy || !edu.startDate || !edu.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    const saved = await saveProfile(educations);
    if (saved) {
      setEditingId(null);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    const updatedEducations = educations.filter(edu => edu.id !== id);
    const saved = await saveProfile(updatedEducations);
    if (saved) {
      setEducations(updatedEducations);
    }
  };

  const renderEducationForm = (edu: EducationItem | Omit<EducationItem, 'id'>, isNew = false) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institute <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={isNew ? newEducation.institute : edu.institute}
            onChange={e => handleInputChange(isNew ? 'new' : (edu as EducationItem).id, 'institute', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={isNew ? newEducation.degree : edu.degree}
            onChange={e => handleInputChange(isNew ? 'new' : (edu as EducationItem).id, 'degree', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={isNew ? newEducation.fieldOfStudy : edu.fieldOfStudy}
            onChange={e => handleInputChange(isNew ? 'new' : (edu as EducationItem).id, 'fieldOfStudy', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="month"
            value={isNew ? newEducation.startDate : edu.startDate}
            onChange={e => handleInputChange(isNew ? 'new' : (edu as EducationItem).id, 'startDate', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="month"
            value={isNew ? newEducation.endDate : edu.endDate}
            onChange={e => handleInputChange(isNew ? 'new' : (edu as EducationItem).id, 'endDate', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={isNew ? newEducation.description : edu.description}
          onChange={e => handleInputChange(isNew ? 'new' : (edu as EducationItem).id, 'description', e.target.value)}
          className="w-full p-2 border rounded min-h-[80px]"
          placeholder="Add details about your education"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => (isNew ? setIsAdding(false) : setEditingId(null))}
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => (isNew ? handleAddEducation() : handleSaveEducation((edu as EducationItem).id))}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isNew ? 'Add Education' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  if (isSessionLoading) return <div>Loading...</div>;
  if (!userId) return <div>Please sign in to manage your education.</div>;

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Education</h3>
        {!isAdding && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Education
          </button>
        )}
      </div>
      {isAdding && renderEducationForm({
        institute: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: '',
      }, true)}

      <div className="space-y-6">
        {educations.map((edu) => (
          <div key={edu.id} className="relative group">
            {editingId === edu.id ? (
              renderEducationForm(edu)
            ) : (
              <div className="border-l-2 border-blue-200 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium">{edu.degree}</h4>
                    <p className="text-blue-600">{edu.institute}</p>
                    <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>
                    <p className="text-gray-500 text-sm">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(edu.id)}
                      className="text-gray-500 hover:text-blue-600"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-gray-500 hover:text-red-600"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
