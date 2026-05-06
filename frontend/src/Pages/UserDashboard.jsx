import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

const UserDashboard = () => {
  const { user } = useAuth();

  // Placeholder data for professional look
  const stats = [
    { label: 'Active Projects', value: '12', icon: '📊', color: 'bg-blue-500' },
    { label: 'Pending Tasks', value: '08', icon: '📝', color: 'bg-orange-500' },
    { label: 'Completed', value: '124', icon: '✅', color: 'bg-green-500' },
    { label: 'Total Hours', value: '320', icon: '⏱️', color: 'bg-purple-500' },
  ];

  const ChevronRightIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <Layout title="Dashboard Overview">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.employee_name?.split(' ')[0]}!</h2>
        <p className="opacity-90 text-sm">Here is what's happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between border border-slate-100 hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-opacity-20 ${stat.color.replace('bg-', 'bg-').replace('500', '100')}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile & Company Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Profile & Company Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">User Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Full Name</p>
                  <p className="font-medium text-slate-800">{user?.employee_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="font-medium text-slate-800">{user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full capitalize">{user?.role}</span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span>
                </div>
              </div>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Company Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Company Name</p>
                  <p className="font-medium text-slate-800">{user?.company_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="font-medium text-slate-800">{user?.company_info?.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Industry</p>
                  <p className="font-medium text-slate-800">{user?.company_info?.industry || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-slate-700 hover:text-blue-700 transition-colors group">
              <span className="text-sm font-medium">Create New Task</span>
              <ChevronRightIcon />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-slate-700 hover:text-blue-700 transition-colors group">
              <span className="text-sm font-medium">Generate Report</span>
              <ChevronRightIcon />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-slate-700 hover:text-blue-700 transition-colors group">
              <span className="text-sm font-medium">Manage Team</span>
              <ChevronRightIcon />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-slate-700 hover:text-blue-700 transition-colors group">
              <span className="text-sm font-medium">Account Settings</span>
              <ChevronRightIcon />
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default UserDashboard;