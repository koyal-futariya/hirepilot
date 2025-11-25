'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { authClient } from '@/lib/auth-client';

interface SkillCategory {
  id: string;
  name: string;
  skills: { id: string; name: string }[];
}

export function SkillsSection() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  // Track other profile fields so backend doesn't overwrite them
  const [personalInfo, setPersonalInfo] = useState<any[]>([]);
  const [about, setAbout] = useState('');
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  // UI states
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<{categoryId: string, skillId: string} | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [editSkillValue, setEditSkillValue] = useState('');
  const [editCategoryValue, setEditCategoryValue] = useState('');

  const session = authClient.useSession();
  const userId = session.data?.user?.id || '';
  const isSessionLoading = session.isPending;

  // Load profile and skills on mount / userId change
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
        // If you want a categories/skills grouping, store in skills field as array of categories:
        setCategories(data.profile?.skills ?? []);
        setPersonalInfo(data.profile?.personalInfo ?? []);
        setAbout(data.profile?.summary ?? '');
        setEducation(data.profile?.education ?? []);
        setExperience(data.profile?.experience ?? []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, [userId]);

  // Save whole profile (but updating only skills here)
  const saveProfile = async (updatedSkills: SkillCategory[]) => {
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
          skills: updatedSkills,
          experience,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert('Failed to save skills: ' + errText);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Save skills error:', error);
      alert('Error saving skills.');
      return false;
    }
  };

  // Add/Update/Delete Category/Skill handlers
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert('Please enter a category name');
      return;
    }
    const updatedCategories = [...categories, {
      id: Date.now().toString(),
      name: newCategory.trim(),
      skills: [],
    }];
    const saved = await saveProfile(updatedCategories);
    if (saved) {
      setCategories(updatedCategories);
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editCategoryValue.trim()) {
      alert('Category name cannot be empty');
      return;
    }
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, name: editCategoryValue.trim() }
        : cat
    );
    const saved = await saveProfile(updatedCategories);
    if (saved) {
      setCategories(updatedCategories);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category and all its skills?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      const saved = await saveProfile(updatedCategories);
      if (saved) setCategories(updatedCategories);
    }
  };

  const handleAddSkill = async (categoryId: string) => {
    if (!newSkill.trim()) {
      alert('Please enter a skill');
      return;
    }
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: [...cat.skills, { id: `${categoryId}-${Date.now()}`, name: newSkill.trim() }],
        };
      }
      return cat;
    });
    const saved = await saveProfile(updatedCategories);
    if (saved) {
      setCategories(updatedCategories);
      setNewSkill('');
      setIsAddingSkill(null);
    }
  };

  const handleUpdateSkill = async (categoryId: string, skillId: string) => {
    if (!editSkillValue.trim()) {
      alert('Skill cannot be empty');
      return;
    }
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: cat.skills.map(skill =>
            skill.id === skillId
              ? { ...skill, name: editSkillValue.trim() }
              : skill
          ),
        };
      }
      return cat;
    });
    const saved = await saveProfile(updatedCategories);
    if (saved) {
      setCategories(updatedCategories);
      setEditingSkill(null);
    }
  };

  const handleDeleteSkill = async (categoryId: string, skillId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: cat.skills.filter(skill => skill.id !== skillId),
        };
      }
      return cat;
    });
    const saved = await saveProfile(updatedCategories);
    if (saved) setCategories(updatedCategories);
  };

  const startEditingSkill = (categoryId: string, skillId: string, currentName: string) => {
    setEditingSkill({ categoryId, skillId });
    setEditSkillValue(currentName);
  };

  const startEditingCategory = (categoryId: string, currentName: string) => {
    setEditingCategory(categoryId);
    setEditCategoryValue(currentName);
  };

  if (isSessionLoading) return <div>Loading...</div>;
  if (!userId) return <div>Please sign in to manage your skills.</div>;

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Skills</h3>
        {!isAddingCategory && (
          <button
            onClick={() => {
              setIsAddingCategory(true);
              setNewCategory('');
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Category
          </button>
        )}
      </div>
      {isAddingCategory && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter category name"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingCategory(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-gray-50 p-4 rounded-lg relative group">
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEditingCategory(category.id, category.name)}
                className="text-gray-400 hover:text-blue-600 p-1"
                title="Edit category"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete category"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            {editingCategory === category.id ? (
              <div className="mb-3">
                <input
                  type="text"
                  value={editCategoryValue}
                  onChange={e => setEditCategoryValue(e.target.value)}
                  className="w-full p-1 text-lg font-medium text-gray-800 bg-white border rounded"
                  autoFocus
                />
                <div className="flex justify-end mt-1 space-x-1">
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateCategory(category.id)}
                    className="text-xs text-green-500 hover:text-green-700"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <h4 className="font-medium text-gray-800 mb-3 text-lg">{category.name}</h4>
            )}
            <div className="flex flex-wrap gap-2">
              {category.skills.map(skill => (
                <div key={skill.id} className="relative group">
                  {editingSkill?.categoryId === category.id && editingSkill?.skillId === skill.id ? (
                    <div className="flex items-center bg-white rounded-full border border-blue-300">
                      <input
                        type="text"
                        value={editSkillValue}
                        onChange={e => setEditSkillValue(e.target.value)}
                        className="px-3 py-1 text-sm rounded-l-full focus:outline-none"
                        autoFocus
                      />
                      <div className="flex">
                        <button
                          onClick={() => setEditingSkill(null)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateSkill(category.id, skill.id)}
                          className="p-1 text-green-500 hover:text-green-700"
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center bg-white px-3 py-1 text-sm rounded-full border border-gray-200 text-gray-700 group-hover:border-blue-200 transition-colors">
                      <span>{skill.name}</span>
                      <div className="ml-1 flex space-x-0.5 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => startEditingSkill(category.id, skill.id, skill.name)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Edit skill"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(category.id, skill.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete skill"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {isAddingSkill === category.id ? (
              <div className="mt-3 flex items-center">
                <input
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  className="flex-1 p-1 text-sm border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add skill"
                  onKeyDown={e => e.key === 'Enter' && handleAddSkill(category.id)}
                  autoFocus
                />
                <div className="flex">
                  <button
                    onClick={() => setIsAddingSkill(null)}
                    className="p-1 text-gray-500 hover:bg-gray-100 border-t border-b border-r border-gray-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAddSkill(category.id)}
                    className="p-1 text-green-500 hover:bg-green-50 border-t border-b border-r border-green-300 rounded-r"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAddingSkill(category.id);
                  setNewSkill('');
                }}
                className="mt-2 flex items-center text-xs text-blue-600 hover:text-blue-800"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add Skill
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
