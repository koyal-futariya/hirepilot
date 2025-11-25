import Image from 'next/image';

export function ProfileHeader() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
        <Image
          src="/default-avatar.png"
          alt="Profile"
          width={128}
          height={128}
          className="object-cover w-full h-full"
        />
        <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold">John Doe</h2>
        <p className="text-gray-600">Software Engineer</p>
        <p className="text-gray-500 text-sm mt-1">San Francisco, CA</p>
        <div className="flex gap-2 justify-center md:justify-start mt-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
            Edit Profile
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
            View Public Profile
          </button>
        </div>
      </div>
    </div>
  );
}
