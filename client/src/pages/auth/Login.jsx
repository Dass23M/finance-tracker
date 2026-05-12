import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form completion progress state
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange', // Validate as the user types
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  // Watch fields for progress calculation
  const watchEmail = watch('email');
  const watchPassword = watch('password');

  // Calculate form completion progress dynamically
  useEffect(() => {
    let currentProgress = 0;
    
    // Check if email matches a valid pattern
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(watchEmail || '')) {
      currentProgress += 50;
    }
    // Check if password meets minimum length
    if (watchPassword?.length >= 8) {
      currentProgress += 50;
    }

    setProgress(currentProgress);
  }, [watchEmail, watchPassword]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login({
        email: data.email.trim(),
        password: data.password,
        rememberMe: data.rememberMe
      });
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700;800&display=swap');
      `}</style>

      <div 
        className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Subtle Background Pattern matching the landing page */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="w-full max-w-md relative z-10">
          
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-5 shadow-md hover:scale-105 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </Link>
            <h1 
              className="text-3xl text-black mb-2" 
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your credentials to securely access your account.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            
            {/* Dynamic Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Login Status</span>
                <span className={progress === 100 ? 'text-green-600' : 'text-sky-500'}>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-black'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 transition-colors focus:outline-none focus:ring-4 disabled:opacity-50 disabled:bg-slate-100 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                  }`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Please enter a valid email address',
                    },
                    maxLength: {
                      value: 255,
                      message: 'Email address is too long'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`w-full pl-4 pr-12 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 transition-colors focus:outline-none focus:ring-4 disabled:opacity-50 disabled:bg-slate-100 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                    }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { 
                        value: 8, 
                        message: 'Password must be at least 8 characters' 
                      },
                      maxLength: {
                        value: 72, 
                        message: 'Password cannot exceed 72 characters'
                      }
                    })}
                  />
                  
                  {/* Password Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-sky-600 rounded disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Security Extras: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black disabled:opacity-50 cursor-pointer"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="font-semibold text-sky-500 hover:text-sky-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || progress < 100}
                className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 bg-black text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:bg-sky-500 hover:shadow-[0_6px_20px_rgba(14,165,233,0.25)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:bg-black disabled:hover:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Account'
                )}
              </button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm text-slate-500 mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;