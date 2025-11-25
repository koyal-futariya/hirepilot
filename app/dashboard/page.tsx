export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Applications Sent</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Interviews</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">8</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[
              { id: 1, title: 'Application sent to Google', time: '2 hours ago', type: 'application' },
              { id: 2, title: 'Interview scheduled with Microsoft', time: '1 day ago', type: 'interview' },
              { id: 3, title: 'Application viewed by Amazon', time: '2 days ago', type: 'application' },
            ].map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1 flex items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
