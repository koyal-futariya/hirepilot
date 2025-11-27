"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { authClient } from "@/lib/auth-client";

interface SkillCategory {
  id: string;
  name: string;
  skills: { id: string; name: string }[];
}

export function SkillsSection() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [personalInfo, setPersonalInfo] = useState<any[]>([]);
  const [about, setAbout] = useState("");
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<{
    categoryId: string;
    skillId: string;
  } | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [editSkillValue, setEditSkillValue] = useState("");
  const [editCategoryValue, setEditCategoryValue] = useState("");

  const session = authClient.useSession();
  const userId = session.data?.user?.id || "";
  const isSessionLoading = session.isPending;

  useEffect(() => {
    if (!userId) return;
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-profile?userId=${userId}`
        );
        if (!res.ok) {
          console.error("Failed to fetch profile");
          return;
        }
        const data = await res.json();
        setCategories(data.profile?.skills ?? []);
        setPersonalInfo(data.profile?.personalInfo ?? []);
        setAbout(data.profile?.summary ?? "");
        setEducation(data.profile?.education ?? []);
        setExperience(data.profile?.experience ?? []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, [userId]);

  const saveProfile = async (updatedSkills: SkillCategory[]) => {
    if (!userId) {
      alert("User not authenticated.");
      return false;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/save-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            personalInfo,
            about,
            education,
            skills: updatedSkills,
            experience,
          }),
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        alert("Failed to save skills: " + errText);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Save skills error:", error);
      alert("Error saving skills.");
      return false;
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name");
      return;
    }
    const updatedCategories = [
      ...categories,
      {
        id: Date.now().toString(),
        name: newCategory.trim(),
        skills: [],
      },
    ];
    const saved = await saveProfile(updatedCategories);
    if (saved) {
      setCategories(updatedCategories);
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editCategoryValue.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    const updatedCategories = categories.map((cat) =>
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
    if (
      window.confirm(
        "Are you sure you want to delete this category and all its skills?"
      )
    ) {
      const updatedCategories = categories.filter(
        (cat) => cat.id !== categoryId
      );
      const saved = await saveProfile(updatedCategories);
      if (saved) setCategories(updatedCategories);
    }
  };

  const handleAddSkill = async (categoryId: string) => {
    if (!newSkill.trim()) {
      alert("Please enter a skill");
      return;
    }
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: [
            ...cat.skills,
            { id: `${categoryId}-${Date.now()}`, name: newSkill.trim() },
          ],
        };
      }
      return cat;
    });
    const saved = await saveProfile(updatedCategories);
    if (saved) {
      setCategories(updatedCategories);
      setNewSkill("");
      setIsAddingSkill(null);
    }
  };

  const handleUpdateSkill = async (categoryId: string, skillId: string) => {
    if (!editSkillValue.trim()) {
      alert("Skill cannot be empty");
      return;
    }
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: cat.skills.map((skill) =>
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
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: cat.skills.filter((skill) => skill.id !== skillId),
        };
      }
      return cat;
    });
    const saved = await saveProfile(updatedCategories);
    if (saved) setCategories(updatedCategories);
  };

  const startEditingSkill = (
    categoryId: string,
    skillId: string,
    currentName: string
  ) => {
    setEditingSkill({ categoryId, skillId });
    setEditSkillValue(currentName);
  };

  const startEditingCategory = (categoryId: string, currentName: string) => {
    setEditingCategory(categoryId);
    setEditCategoryValue(currentName);
  };

  if (isSessionLoading) {
    return (
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Loading skills...</p>
      </section>
    );
  }

  if (!userId) {
    return (
      <section className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
        Please sign in to manage your skills.
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <p className="mt-1 text-xs text-gray-500">
            Organize your technical and soft skills into categories.
          </p>
        </div>
        {!isAddingCategory && (
          <button
            onClick={() => {
              setIsAddingCategory(true);
              setNewCategory("");
            }}
            className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            <PlusIcon className="mr-1.5 h-4 w-4" />
            Add Category
          </button>
        )}
      </div>

      {isAddingCategory && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Frontend, Backend, Tools"
              autoFocus
            />
            <div className="flex justify-end gap-2 md:justify-start">
              <button
                onClick={() => setIsAddingCategory(false)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {categories.length === 0 && !isAddingCategory && (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-6 text-center">
          <p className="text-sm text-gray-500">
            You have not added any skills yet.
          </p>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="mt-3 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            <PlusIcon className="mr-1.5 h-4 w-4" />
            Create your first category
          </button>
        </div>
      )}

      {categories.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative rounded-xl border border-gray-100 bg-gray-50/80 p-4 shadow-sm hover:border-blue-100 hover:bg-blue-50/50 transition-colors"
            >
              <div className="absolute right-2 top-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() =>
                    startEditingCategory(category.id, category.name)
                  }
                  className="rounded-full p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                  title="Edit category"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
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
                    onChange={(e) => setEditCategoryValue(e.target.value)}
                    className="w-full rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    autoFocus
                  />
                  <div className="mt-1 flex justify-end gap-1">
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      className="rounded-full p-1 text-green-600 hover:bg-green-50"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  {category.name}
                </h4>
              )}

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="relative">
                    {editingSkill?.categoryId === category.id &&
                    editingSkill?.skillId === skill.id ? (
                      <div className="flex items-center rounded-full border border-blue-200 bg-white text-sm shadow-sm">
                        <input
                          type="text"
                          value={editSkillValue}
                          onChange={(e) => setEditSkillValue(e.target.value)}
                          className="rounded-l-full px-3 py-1 text-xs focus:outline-none"
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
                            onClick={() =>
                              handleUpdateSkill(category.id, skill.id)
                            }
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group/skill inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm transition-colors group-hover:border-blue-200">
                        <span>{skill.name}</span>
                        <div className="ml-1 flex gap-0.5 opacity-0 transition-opacity group-hover/skill:opacity-100">
                          <button
                            onClick={() =>
                              startEditingSkill(
                                category.id,
                                skill.id,
                                skill.name
                              )
                            }
                            className="text-gray-400 hover:text-blue-600"
                            title="Edit skill"
                          >
                            <PencilIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteSkill(category.id, skill.id)
                            }
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
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 rounded-l-lg border border-gray-200 bg-white px-3 py-1.5 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Add a skill (e.g. React, Node.js)"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddSkill(category.id)
                    }
                    autoFocus
                  />
                  <div className="flex">
                    <button
                      onClick={() => setIsAddingSkill(null)}
                      className="border-y border-r border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAddSkill(category.id)}
                      className="border-y border-r border-green-300 bg-green-50 p-1.5 text-green-600 hover:bg-green-100"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAddingSkill(category.id);
                    setNewSkill("");
                  }}
                  className="mt-3 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  Add Skill
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
