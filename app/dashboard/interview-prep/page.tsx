export default function InterviewPrepPage() {
  const categories = [
    {
      name: 'Technical Questions',
      count: 24,
      icon: '💻',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Behavioral Questions',
      count: 18,
      icon: '👥',
      color: 'bg-green-100 text-green-800',
    },
    {
      name: 'System Design',
      count: 12,
      icon: '🏗️',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      name: 'Coding Challenges',
      count: 30,
      icon: '💡',
      color: 'bg-yellow-100 text-yellow-800',
    },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      company: 'TechCorp',
      role: 'Senior Developer',
      date: '2023-06-15',
      time: '14:30',
      type: 'Technical',
    },
    {
      id: 2,
      company: 'InnovateX',
      role: 'Frontend Engineer',
      date: '2023-06-18',
      time: '10:00',
      type: 'Technical',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Interview Preparation</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${category.color}`}>
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {category.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {category.count} questions
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Start Practicing
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Common Interview Questions</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {[
                'Tell me about yourself and your experience.',
                'What is your greatest strength and weakness?',
                'Describe a challenging situation and how you handled it.',
                'Why do you want to work for our company?',
                'Where do you see yourself in 5 years?',
              ].map((question, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{question}</p>
                    <button className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Practice
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Interviews</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {upcomingInterviews.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingInterviews.map((interview) => (
                  <li key={interview.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{interview.company}</p>
                        <p className="text-sm text-gray-500">{interview.role}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(interview.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {' at '}{interview.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                No upcoming interviews scheduled.
              </div>
            )}
            <div className="px-6 py-4 bg-gray-50 text-right">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Schedule Mock Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
