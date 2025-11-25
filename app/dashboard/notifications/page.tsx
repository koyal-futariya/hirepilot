export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'New job match',
      message: 'Your profile matches a new job at TechCorp',
      time: '2 minutes ago',
      read: false,
      type: 'job_match',
    },
    {
      id: 2,
      title: 'Application viewed',
      message: 'Your application for Senior Developer at InnovateX has been viewed',
      time: '1 hour ago',
      read: false,
      type: 'application',
    },
    {
      id: 3,
      title: 'Interview scheduled',
      message: 'Interview scheduled with Google for Software Engineer position',
      time: '2 days ago',
      read: true,
      type: 'interview',
    },
    {
      id: 4,
      title: 'Profile update',
      message: 'Your profile is 80% complete. Add more details to increase your visibility',
      time: '3 days ago',
      read: true,
      type: 'reminder',
    },
    {
      id: 5,
      title: 'New feature',
      message: 'Check out our new interview preparation tools',
      time: '1 week ago',
      read: true,
      type: 'announcement',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'application':
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'interview':
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'reminder':
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Mark all as read
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id} className={!notification.read ? 'bg-blue-50' : 'bg-white'}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    {getIcon(notification.type)}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                      <p className={`text-sm ${!notification.read ? 'text-blue-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any notifications yet.</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notification preferences</h3>
          <div className="mt-5">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="email-notifications"
                  name="email-notifications"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  defaultChecked={true}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="email-notifications" className="font-medium text-gray-700">
                  Email notifications
                </label>
                <p className="text-gray-500">Get notified when there's activity on your applications.</p>
              </div>
            </div>
            <div className="mt-4 flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="push-notifications"
                  name="push-notifications"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  defaultChecked={true}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="push-notifications" className="font-medium text-gray-700">
                  Push notifications
                </label>
                <p className="text-gray-500">Get push notifications in your browser.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
