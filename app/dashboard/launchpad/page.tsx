export default function LaunchpadPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Launchpad</h1>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add New Job
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Job Card */}
        {[1, 2, 3].map((job) => (
          <div key={job} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 16h.01" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Senior Software Engineer
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        Tech Company Inc.
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  View application
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Application Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Applied', 'Interview', 'Offer', 'Hired'].map((stage, index) => (
            <div key={stage} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-900 mb-3">{stage}</h3>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm font-medium">Job Title {item}</p>
                    <p className="text-xs text-gray-500">Company {item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
