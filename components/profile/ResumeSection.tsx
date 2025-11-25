'use client';


import { useState, useRef, ChangeEvent } from 'react';
import { TrashIcon, DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';


interface Resume {
  id: string;
  name: string;
  url: string;
  size: number;
  lastModified: number;
  file?: File;
}


export function ResumeSection() {
  const currentUserId = 'user-unique-id'; // Replace with real user ID from your auth


  const [resume, setResume] = useState<Resume | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    // Validate file type and size
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }


    const fileUrl = URL.createObjectURL(file);
    setResume({
      id: Date.now().toString(),
      name: file.name,
      url: fileUrl,
      size: file.size,
      lastModified: file.lastModified,
      file,
    });


    setPreviewUrl(file.type === 'application/pdf' ? fileUrl : null);


    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleUpload = async () => {
    if (!resume?.file) return;
    setIsUploading(true);


    try {
      const formData = new FormData();
      formData.append('resume', resume.file);
      formData.append('userId', currentUserId);


      const response = await fetch('http://localhost:4000/api/upload-resume', {
        method: 'POST',
        body: formData,
      });


      const data = await response.json();


      if (data.success) {
        alert('Resume uploaded successfully!');
        setResume((prev) =>
          prev ? { ...prev, url: data.url, name: data.filename } : prev,
        );
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };


  const handleDelete = async () => {
    if (!resume) return;
    if (!window.confirm('Are you sure you want to delete this resume?')) return;


    try {
      const response = await fetch('http://localhost:4000/api/delete-resume', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: resume.name, userId: currentUserId }),
      });


      const data = await response.json();


      if (data.success) {
        alert('Resume deleted');
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setResume(null);
        setPreviewUrl(null);
      } else {
        alert('Failed to delete resume: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error deleting resume');
    }
  };


  const handleDownload = () => {
    if (!resume) return;
    const link = document.createElement('a');
    link.href = resume.url;
    link.download = resume.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Resume</h3>
        {resume && (
          <button
            onClick={handleDelete}
            className="flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete Resume
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
                  <h4 className="text-sm font-medium text-gray-900">{resume.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(resume.size)} • Updated {formatDate(resume.lastModified)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                {resume.file?.type === 'application/pdf' && (
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Preview
                  </a>
                )}
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Download
                </button>
              </div>
            </div>
            {previewUrl && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-[500px]"
                    title="Resume Preview"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resume uploaded</h3>
            <p className="mt-1 text-sm text-gray-500">Upload your resume to get started</p>
          </div>
        )}
        <div className="mt-6">
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="resume-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <div className="flex flex-col items-center">
                    <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <span className="mt-2">Upload a file</span>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, or DOCX up to 5MB
                    </p>
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    ref={fileInputRef}
                    className="sr-only"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    name="resume"
                  />
                </label>
              </div>
            </div>
          </div>
          {resume && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isUploading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}