import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      const success = await login({
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        navigate('/dashboard');
      }
    } else {
      const success = await register(formData);
      if (success) {
        alert('Registration successful! Please login.');
        setIsLoginMode(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary-900 mb-2">OUTA ERP</h1>
          <p className="text-primary-700">Next-Generation Saudi ERP System</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 text-center font-semibold rounded-lg transition-colors ${
                isLoginMode
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 text-center font-semibold rounded-lg ml-2 transition-colors ${
                !isLoginMode
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required={!isLoginMode}
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required={!isLoginMode}
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+966501234567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : isLoginMode ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Built with Claude Opus 4.5 for Vision 2030</p>
          </div>
        </div>

        {/* Quick Demo Credentials */}
        <div className="mt-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-700 mb-1">Demo Credentials:</p>
          <p className="text-gray-600">Register a new account or use the API to create one</p>
        </div>
      </div>
    </div>
  );
}
