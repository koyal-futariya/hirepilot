export default function StatisticsPage() {
  // Sample data for charts
  const applicationStatusData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        data: [24, 8, 3, 5],
        backgroundColor: [
          '#3B82F6', // blue-500
          '#F59E0B', // amber-500
          '#10B981', // emerald-500
          '#EF4444', // red-500
        ],
      },
    ],
  };

  const applicationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: [5, 8, 12, 15, 18, 24],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const statusData = [
    { name: 'Applied', count: 24, bg: 'bg-blue-100 text-blue-800' },
    { name: 'Interview', count: 8, bg: 'bg-amber-100 text-amber-800' },
    { name: 'Offer', count: 3, bg: 'bg-emerald-100 text-emerald-800' },
    { name: 'Rejected', count: 5, bg: 'bg-red-100 text-red-800' },
  ];

  const recentActivity = [
    { id: 1, action: 'Application sent to Google', date: '2 hours ago', type: 'application' },
    { id: 2, action: 'Interview scheduled with Microsoft', date: '1 day ago', type: 'interview' },
    { id: 3, action: 'Application viewed by Amazon', date: '2 days ago', type: 'application' },
    { id: 4, action: 'Application sent to Netflix', date: '3 days ago', type: 'application' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Job Search Statistics</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {statusData.map((item) => (
          <div key={item.name} className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.bg}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.count}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Application Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64 h-64 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">40</div>
                  <div className="text-sm text-gray-500">Total Applications</div>
                </div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {applicationStatusData.labels.map((label, i) => {
                  const value = applicationStatusData.datasets[0].data[i];
                  const color = applicationStatusData.datasets[0].backgroundColor[i];
                  const total = applicationStatusData.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = (value / total) * 100;
                  const startAngle = i === 0 ? 0 : 
                    applicationStatusData.datasets[0].data.slice(0, i).reduce((a, b) => a + b, 0) / total * 360;
                  
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={color}
                      strokeWidth="20"
                      strokeDasharray={`${percentage * 3.6} ${360 - percentage * 3.6}`}
                      strokeDashoffset={`${-startAngle * 3.6 + 25}`}
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-500 ease-in-out"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {applicationStatusData.labels.map((label, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: applicationStatusData.datasets[0].backgroundColor[i] }}
                ></div>
                <span className="text-sm text-gray-600">{label}</span>
                <span className="ml-auto font-medium">
                  {Math.round((applicationStatusData.datasets[0].data[i] / 
                    applicationStatusData.datasets[0].data.reduce((a, b) => a + b, 0)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Application Trend</h2>
          <div className="h-64">
            <div className="h-full flex items-end space-x-2">
              {applicationTrendData.datasets[0].data.map((value, i) => {
                const maxValue = Math.max(...applicationTrendData.datasets[0].data);
                const height = (value / maxValue) * 80; // 80% of container height
                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-300"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{applicationTrendData.labels[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-green-600">+12%</span> from last month
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {activity.type === 'interview' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        )}
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
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
