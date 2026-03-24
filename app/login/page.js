"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaEye, 
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? false : true;
  
  const [isLogin, setIsLogin] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Get auth store
  const { login, signup, user, isLoading: storeLoading, error: storeError, clearError } = useAuthStore();
  console.log('login page user',user);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    mode: 'onChange'
  });

  const password = watch('password', '');

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  // Clear error when switching tabs
  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = async (data) => {
    setLoading(true);
    clearError();
    
    try {
      if (isLogin) {
        // Login
        const result = await login(data.email, data.password, rememberMe);
        console.log('from loginpage',result);
        
        if (result.success) {
          toast.success('Welcome back! Login successful!', {
            icon: '👋',
            duration: 3000,
          });
          router.push('/');
        }
      } else {
        // Signup
        const result = await signup(data.name, data.email, data.password);
        
        if (result.success) {
          toast.success('Account created successfully! Welcome to Ghorchai!', {
            icon: '🎉',
            duration: 3000,
          });
          router.push('/');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed', {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`, {
      icon: '🚀',
    });
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors group z-10"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-orange-500 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-2xl">G</div>
            </div>
            <span className="text-3xl font-bold text-gray-900">horchai</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
          {/* Header with Tabs */}
          <div className="flex mb-8 bg-orange-50 rounded-2xl p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                reset();
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                reset();
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Display */}
          {storeError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {storeError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field - Signup only */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('name', { 
                        required: !isLogin && 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    validate: !isLogin ? {
                      hasNumber: (v) => /\d/.test(v) || 'Password must contain at least one number',
                      hasLetter: (v) => /[a-zA-Z]/.test(v) || 'Password must contain at least one letter',
                    } : undefined
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {!isLogin && password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                        className={`h-full ${getPasswordStrengthColor()}`}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{getPasswordStrengthText()}</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li className={`flex items-center gap-1 ${password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`}>
                      {password.length >= 6 ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                      At least 6 characters
                    </li>
                    <li className={`flex items-center gap-1 ${/[a-zA-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[a-zA-Z]/.test(password) ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                      Contains letters
                    </li>
                    <li className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/\d/.test(password) ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                      Contains numbers
                    </li>
                  </ul>
                </div>
              )}

              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me - Login only */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || storeLoading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {(loading || storeLoading) ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <FaFacebookF className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500">Facebook</span>
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500">
              By continuing, you agree to Ghorchai's{' '}
              <Link href="/terms" className="text-orange-500 hover:text-orange-600 font-medium">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-orange-500 hover:text-orange-600 font-medium">Privacy Policy</Link>
            </p>
          </form>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <FaShieldAlt className="text-orange-500" />
            <span className="text-sm text-gray-600">Your data is protected with 256-bit encryption</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// // app/login/page.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { useForm } from "react-hook-form";
// import { useAuthStore } from "../store/authStore";
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   FaEnvelope, 
//   FaLock, 
//   FaUser, 
//   FaEye, 
//   FaEyeSlash,
//   FaGoogle,
//   FaFacebookF,
//   FaArrowLeft,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaShieldAlt,
//   FaHome
// } from "react-icons/fa";
// import { MdEmail, MdPhone } from "react-icons/md";

// export default function LoginPage() {
//   const router = useRouter();
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const { login, signup, user } = useAuthStore();
//   const { register, handleSubmit, watch, formState: { errors }, reset, trigger } = useForm({
//     mode: 'onChange'
//   });

//   const password = watch('password', '');

//   // Check password strength
//   useEffect(() => {
//     if (!password) {
//       setPasswordStrength(0);
//       return;
//     }
    
//     let strength = 0;
//     if (password.length >= 6) strength += 1;
//     if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
//     if (password.match(/\d/)) strength += 1;
//     if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    
//     setPasswordStrength(strength);
//   }, [password]);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) {
//       router.push('/');
//     }
//   }, [user, router]);

//   const onSubmit = async (data) => {
//     console.log(data);
//     setLoading(true);
//     try {
//       if (isLogin) {
//         // Call login API
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             email: data.email,
//             password: data.password,
//             rememberMe: rememberMe
//           }),
//         });

//         const result = await response.json();
//         console.log(result);

//         if (!response.ok) {
//           throw new Error(result.message || 'Login failed');
//         }

//         // Store user data and token
//         // if (result.token) {
//         //   localStorage.setItem('token', result.token);
//         //   if (rememberMe) {
//         //     localStorage.setItem('rememberMe', 'true');
//         //   }
//         // }
        
//         // Update auth store
//         // await login(data.email, data.password);
//         // console.log(await login(data.email, data.password));
        
//         toast.success('Welcome back! Login successful!', {
//           icon: '👋',
//           style: {
//             borderRadius: '10px',
//             background: '#10b981',
//             color: '#fff',
//           },
//         });
        
//         // router.push('/');
//       } else {
//         // Call signup API
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             name: data.name,
//             email: data.email,
//             password: data.password,
//           }),
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message || 'Registration failed');
//         }

//         // Store user data and token
//         if (result.token) {
//           localStorage.setItem('token', result.token);
//         }
        
//         // Update auth store
//         await signup(data.name, data.email, data.password);
        
//         toast.success('Account created successfully! Welcome to Ghorchai!', {
//           icon: '🎉',
//           style: {
//             borderRadius: '10px',
//             background: '#10b981',
//             color: '#fff',
//           },
//         });
        
//         router.push('/');
//       }
//     } catch (error) {
//       toast.error(error.message || 'Authentication failed', {
//         icon: '❌',
//         style: {
//           borderRadius: '10px',
//           background: '#ef4444',
//           color: '#fff',
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSocialLogin = async (provider) => {
//     setLoading(true);
//     try {
//       // Redirect to social auth endpoint
//       window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider.toLowerCase()}`;
//     } catch (error) {
//       toast.error(`${provider} login failed. Please try again.`, {
//         icon: '❌',
//       });
//       setLoading(false);
//     }
//   };

//   const getPasswordStrengthColor = () => {
//     switch(passwordStrength) {
//       case 1: return 'bg-red-500';
//       case 2: return 'bg-orange-500';
//       case 3: return 'bg-yellow-500';
//       case 4: return 'bg-green-500';
//       default: return 'bg-gray-200';
//     }
//   };

//   const getPasswordStrengthText = () => {
//     switch(passwordStrength) {
//       case 1: return 'Weak';
//       case 2: return 'Fair';
//       case 3: return 'Good';
//       case 4: return 'Strong';
//       default: return '';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//       {/* Background Decorative Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Back to Home Button */}
//       <Link
//         href="/"
//         className="absolute top-8 left-8 flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors group z-10"
//       >
//         <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
//         <span>Back to Home</span>
//       </Link>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-md w-full relative z-10"
//       >
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center justify-center space-x-2">
//             <div className="relative w-12 h-12">
//               <div className="absolute inset-0 bg-orange-500 rounded-lg transform rotate-3"></div>
//               <div className="absolute inset-0 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
//                 G
//               </div>
//             </div>
//             <span className="text-3xl font-bold text-gray-900 dark:text-white">horchai</span>
//           </Link>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-orange-100 dark:border-gray-700">
//           {/* Header with Tabs */}
//           <div className="flex mb-8 bg-orange-50 dark:bg-gray-700 rounded-2xl p-1">
//             <button
//               onClick={() => {
//                 setIsLogin(true);
//                 reset();
//               }}
//               className={`flex-1 py-3 rounded-xl font-medium transition-all ${
//                 isLogin
//                   ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
//                   : 'text-gray-600 dark:text-gray-300 hover:text-orange-500'
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => {
//                 setIsLogin(false);
//                 reset();
//               }}
//               className={`flex-1 py-3 rounded-xl font-medium transition-all ${
//                 !isLogin
//                   ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
//                   : 'text-gray-600 dark:text-gray-300 hover:text-orange-500'
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             {/* Name Field - Signup only */}
//             <AnimatePresence>
//               {!isLogin && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="space-y-1"
//                 >
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Full Name
//                   </label>
//                   <div className="relative">
//                     <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       {...register('name', { 
//                         required: !isLogin && 'Name is required',
//                         minLength: {
//                           value: 2,
//                           message: 'Name must be at least 2 characters'
//                         }
//                       })}
//                       type="text"
//                       className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   {errors.name && (
//                     <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                       <FaTimesCircle size={12} />
//                       {errors.name.message}
//                     </p>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Email Field */}
//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   {...register('email', { 
//                     required: 'Email is required',
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: 'Invalid email address'
//                     }
//                   })}
//                   type="email"
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//                   placeholder="you@example.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                   <FaTimesCircle size={12} />
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Password
//               </label>
//               <div className="relative">
//                 <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   {...register('password', { 
//                     required: 'Password is required',
//                     minLength: {
//                       value: 6,
//                       message: 'Password must be at least 6 characters'
//                     },
//                     validate: !isLogin ? {
//                       hasNumber: (v) => /\d/.test(v) || 'Password must contain at least one number',
//                       hasLetter: (v) => /[a-zA-Z]/.test(v) || 'Password must contain at least one letter',
//                     } : undefined
//                   })}
//                   type={showPassword ? 'text' : 'password'}
//                   className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
//                 >
//                   {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
//                 </button>
//               </div>

//               {/* Password Strength Meter - Signup only */}
//               {!isLogin && password && (
//                 <div className="mt-2 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${(passwordStrength / 4) * 100}%` }}
//                         className={`h-full ${getPasswordStrengthColor()}`}
//                       />
//                     </div>
//                     <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
//                       {getPasswordStrengthText()}
//                     </span>
//                   </div>
//                   <ul className="text-xs space-y-1">
//                     <li className={`flex items-center gap-1 ${password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`}>
//                       {password.length >= 6 ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
//                       At least 6 characters
//                     </li>
//                     <li className={`flex items-center gap-1 ${/[a-zA-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
//                       {/[a-zA-Z]/.test(password) ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
//                       Contains letters
//                     </li>
//                     <li className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
//                       {/\d/.test(password) ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
//                       Contains numbers
//                     </li>
//                   </ul>
//                 </div>
//               )}

//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                   <FaTimesCircle size={12} />
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password - Login only */}
//             {isLogin && (
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
//                   />
//                   <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
//                 </label>
//                 <Link
//                   href="/forgot-password"
//                   className="text-sm text-orange-500 hover:text-orange-600 font-medium"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
//               )}
//             </button>

//             {/* Social Login */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 onClick={() => handleSocialLogin('Google')}
//                 disabled={loading}
//                 className="flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaGoogle className="text-red-500" />
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-500">
//                   Google
//                 </span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleSocialLogin('Facebook')}
//                 disabled={loading}
//                 className="flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaFacebookF className="text-blue-600" />
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-500">
//                   Facebook
//                 </span>
//               </button>
//             </div>

//             {/* Terms and Privacy */}
//             <p className="text-center text-xs text-gray-500 dark:text-gray-400">
//               By continuing, you agree to Ghorchai's{' '}
//               <Link href="/terms" className="text-orange-500 hover:text-orange-600 font-medium">
//                 Terms of Service
//               </Link>{' '}
//               and{' '}
//               <Link href="/privacy" className="text-orange-500 hover:text-orange-600 font-medium">
//                 Privacy Policy
//               </Link>
//             </p>
//           </form>
//         </div>

//         {/* Trust Badge */}
//         <div className="mt-6 text-center">
//           <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
//             <FaShieldAlt className="text-orange-500" />
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               Your data is protected with 256-bit encryption
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }