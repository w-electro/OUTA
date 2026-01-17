import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Invoices', value: '0', color: 'bg-blue-500' },
    { label: 'Pending Invoices', value: '0', color: 'bg-yellow-500' },
    { label: 'Total Revenue', value: 'SAR 0', color: 'bg-green-500' },
    { label: 'This Month', value: 'SAR 0', color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Create Invoice', icon: '📄', action: () => navigate('/invoices') },
    { label: 'View Reports', icon: '📊', action: () => alert('Reports coming soon!') },
    { label: 'ZATCA Submissions', icon: '✅', action: () => alert('ZATCA tracking coming soon!') },
    { label: 'Settings', icon: '⚙️', action: () => alert('Settings coming soon!') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-900">OUTA ERP</h1>
              <p className="text-gray-600">Next-Generation Saudi ERP System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.first_name}! 👋
          </h2>
          <p className="text-primary-100">
            Here's what's happening with your business today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-gray-50 hover:bg-primary-50 border-2 border-gray-200 hover:border-primary-300 rounded-xl p-6 text-center transition-all"
              >
                <div className="text-4xl mb-2">{action.icon}</div>
                <p className="font-semibold text-gray-900">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🚀 OUTA ERP Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">✅ ZATCA Phase 2 Ready</h4>
              <p className="text-gray-600 text-sm">
                Full compliance with Saudi e-invoicing regulations
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🤖 AI-Powered</h4>
              <p className="text-gray-600 text-sm">
                Claude Opus 4.5 integration for intelligent insights
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">☁️ Cloud-Native</h4>
              <p className="text-gray-600 text-sm">
                Modern microservices architecture for superior performance
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
