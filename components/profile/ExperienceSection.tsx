'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { authClient } from '@/lib/auth-client';

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  // Track other profile fields so backend doesn't overwrite them
  const [personalInfo, setPersonalInfo] = useState<any[]>([]);
  const [about, setAbout] = useState('');
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({ 
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [editExperience, setEditExperience] = useState<Experience>({
    id: '',
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const session = authClient.useSession();
  const userId = session.data?.user?.id;
  const isSessionLoading = session.isPending;

  // Fetch full profile but only store/operate on experience locally
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
        
        setExperiences(
          (data.profile?.experience ?? []).map((exp: any) => ({
            id: exp.id || `${exp.company}-${exp.startDate ?? ''}`,
            title: exp.title ?? '',
            company: exp.company ?? '',
            location: exp.location ?? '',
            startDate: exp.startDate ?? '',
            endDate: exp.current ? '' : (exp.endDate ?? ''),
            current: exp.current ?? false,
            description: exp.description ?? ''
          }))
        );
        
        // Store other fields so we can always send the full profile on save
        setPersonalInfo(data.profile?.personalInfo ?? []);
        setAbout(data.profile?.summary ?? '');
        setEducation(data.profile?.education ?? []);
        setSkills(data.profile?.skills ?? []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    
    fetchProfile();
  }, [userId]);

  // Save the entire profile, but only experience changes
  const saveProfile = async (updatedExperiences: Experience[]) => {
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
          education,
          experience: updatedExperiences,
          skills,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to save profile');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save experience. Please try again.');
      return false;
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.startDate) return;

    const newExp = {
      ...newExperience,
      id: `new-${Date.now()}`,
    };

    const updatedExperiences = [...experiences, newExp];
    setExperiences(updatedExperiences);
    
    const success = await saveProfile(updatedExperiences);
    if (success) {
      setIsAdding(false);
      setNewExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    } else {
      // Revert if save fails
      setExperiences(experiences);
    }
  };

  const handleUpdateExperience = async () => {
    if (!editingId || !editExperience.title || !editExperience.company || !editExperience.startDate) return;

    const updatedExperiences = experiences.map(exp => 
      exp.id === editingId ? { ...editExperience } : exp
    );
    
    setExperiences(updatedExperiences);
    
    const success = await saveProfile(updatedExperiences);
    if (success) {
      setEditingId(null);
    } else {
      // Revert if save fails
      setExperiences(experiences);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    
    const success = await saveProfile(updatedExperiences);
    if (!success) {
      // Revert if save fails
      setExperiences(experiences);
    }
  };

  const handleInputChange = (id: string, field: keyof Experience, value: string | boolean) => {
    if (id === 'new') {
      setNewExperience(prev => ({ ...prev, [field]: value }));
    } else if (editingId) {
      setEditExperience(prev => ({ ...prev, [field]: value }));
    }
  };

  const renderExperienceForm = (exp: Experience | Omit<Experience, 'id'>, isNew = false) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={isNew ? newExperience.title : (exp as Experience).title}
            onChange={(e) => handleInputChange(isNew ? 'new' : (exp as Experience).id, 'title', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={isNew ? newExperience.company : (exp as Experience).company}
            onChange={(e) => handleInputChange(isNew ? 'new' : (exp as Experience).id, 'company', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={isNew ? newExperience.location || '' : (exp as Experience).location || ''}
            onChange={(e) => handleInputChange(isNew ? 'new' : (exp as Experience).id, 'location', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. San Francisco, CA"
          />
        </div>
        <div className="flex items-center">
          <input
            id={isNew ? 'current-role' : `current-role-${(exp as Experience).id}`}
            type="checkbox"
            checked={isNew ? newExperience.current : (exp as Experience).current}
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isNew) {
                setNewExperience(prev => ({
                  ...prev,
                  current: isChecked,
                  endDate: isChecked ? '' : prev.endDate
                }));
              } else if (editingId) {
                setEditExperience(prev => ({
                  ...prev,
                  current: isChecked,
                  endDate: isChecked ? '' : prev.endDate
                }));
              }
            }}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label 
            htmlFor={isNew ? 'current-role' : `current-role-${(exp as Experience).id}`} 
            className="ml-2 block text-sm text-gray-700"
          >
            I am currently working in this role
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="month"
            value={isNew ? newExperience.startDate : (exp as Experience).startDate}
            onChange={(e) => handleInputChange(isNew ? 'new' : (exp as Experience).id, 'startDate', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isNew 
              ? (newExperience.current ? 'End Date' : 'End Date <span class="text-red-500">*</span>')
              : ((exp as Experience).current ? 'End Date' : 'End Date <span class="text-red-500">*</span>')
            }
          </label>
          <input
            type="month"
            value={isNew ? newExperience.endDate : (exp as Experience).endDate}
            onChange={(e) => handleInputChange(isNew ? 'new' : (exp as Experience).id, 'endDate', e.target.value)}
            className={`w-full p-2 border rounded ${(isNew ? newExperience.current : (exp as Experience).current) ? 'bg-gray-100' : ''}`}
            disabled={isNew ? newExperience.current : (exp as Experience).current}
            required={!(isNew ? newExperience.current : (exp as Experience).current)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={isNew ? newExperience.description : (exp as Experience).description}
          onChange={(e) => handleInputChange(isNew ? 'new' : (exp as Experience).id, 'description', e.target.value)}
          className="w-full p-2 border rounded min-h-[80px]"
          placeholder="Describe your role and responsibilities"
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
          onClick={() => (isNew ? handleAddExperience() : handleUpdateExperience())}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!(
            isNew 
              ? (newExperience.title && newExperience.company && newExperience.startDate && (newExperience.current || newExperience.endDate))
              : (editExperience.title && editExperience.company && editExperience.startDate && (editExperience.current || editExperience.endDate))
          )}
        >
          {isNew ? 'Add Experience' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  if (isSessionLoading) return <div>Loading...</div>;
  if (!userId) return <div>Please sign in to manage your experience.</div>;

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Experience</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Experience
          </button>
        )}
      </div>
      
      {isAdding && renderExperienceForm({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }, true)}

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative group">
            {editingId === exp.id ? (
              renderExperienceForm(exp)
            ) : (
              <div className="border-l-2 border-blue-200 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium">{exp.title}</h4>
                    <p className="text-blue-600">{exp.company} {exp.location && `• ${exp.location}`}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditExperience({ ...exp });
                        setEditingId(exp.id);
                      }}
                      className="text-gray-500 hover:text-blue-600"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
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
        
        {!isAdding && experiences.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">No experience added yet.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Experience
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
