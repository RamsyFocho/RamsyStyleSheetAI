import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Key } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
  };

  const validateInput = (fieldName, value) => {
    let newErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        if (!value) newErrors.name = "Name is required.";
        else if (value.length < 2) newErrors.name = "Name must be at least 2 characters long.";
        else delete newErrors.name;
        break;
      case 'email':
        if (!value) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Email address is invalid.";
        else delete newErrors.email;
        break;
      case 'password':
        const passwordErrors = [];
        if (!value) {
            newErrors.password = "Password is required.";
        } else {
            if (value.length < 8) passwordErrors.push("at least 8 characters");
            if (!/[A-Z]/.test(value)) passwordErrors.push("an uppercase letter");
            if (!/[a-z]/.test(value)) passwordErrors.push("a lowercase letter");
            if (!/[0-9]/.test(value)) passwordErrors.push("a number");
            if (!/[^A-Za-z0-9]/.test(value)) passwordErrors.push("a special character");

            if (passwordErrors.length > 0) {
                newErrors.password = `Must contain ${passwordErrors.join(', ')}.`;
            } else {
                delete newErrors.password;
            }
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };
  
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin) {
      checkPasswordStrength(newPassword);
      validateInput('password', newPassword);
    }
  };

  const validateForm = () => {
      const newErrors = {};
      // Name validation
      if (!name || name.length < 2) newErrors.name = "Name must be at least 2 characters long.";
      
      // Email validation
      if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "A valid email is required.";
      
      // Strict Password validation
      const passwordErrors = [];
      if (!password) {
          passwordErrors.push("a password");
      } else {
          if (password.length < 8) passwordErrors.push("at least 8 characters");
          if (!/[A-Z]/.test(password)) passwordErrors.push("an uppercase letter");
          if (!/[a-z]/.test(password)) passwordErrors.push("a lowercase letter");
          if (!/[0-9]/.test(password)) passwordErrors.push("a number");
          if (!/[^A-Za-z0-9]/.test(password)) passwordErrors.push("a special character");
      }
      if (passwordErrors.length > 0) {
          newErrors.password = `Password must contain ${passwordErrors.join(', ')}.`;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        toast({
          title: "Registration Blocked",
          description: "Please correct the errors before submitting.",
          variant: "destructive"
        });
        return;
    }
    setLoading(true);
    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        setIsLogin(true);
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderPasswordStrength = () => {
    const strengthColors = ['bg-gray-600', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Okay', 'Good', 'Strong', 'Very Strong'];
    
    return (
        <div className="flex items-center gap-2 mt-2">
            <div className="w-full h-2 bg-gray-700 rounded-full flex gap-1 p-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`h-full w-1/5 rounded-full transition-colors ${passwordStrength > i ? strengthColors[passwordStrength] : 'bg-gray-700'}`}></div>
              ))}
            </div>
            <span className="text-xs font-medium text-gray-300 w-24 text-right">{strengthLabels[passwordStrength]}</span>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a052e] font-sans text-white flex items-center justify-center p-4 overflow-hidden relative">
      {/* Meteor Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(6)].map((_, i) => <div key={i} className="meteor h-1 w-20" style={{'--meteor-width': `${Math.random() * 80 + 40}px`, '--meteor-height': `${Math.random() * 2 + 1}px`}}/>)}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 text-purple-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/20 p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.5)]">
               <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 mb-2">
              {isLogin ? 'Access Gateway' : 'Create Protocol'}
            </h1>
            <p className="text-purple-200/80">
              {isLogin ? 'Authenticate to interface with the system' : 'Register to join the network'}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/70 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Callsign (Full Name)"
                    value={name}
                    onChange={(e) => {setName(e.target.value); validateInput('name', e.target.value)}}
                    className={`w-full bg-gray-900/50 border-2 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all ${errors.name ? 'border-red-500' : 'border-purple-500/30 focus:border-fuchsia-500'}`}
                    required
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1 ml-2">{errors.name}</p>}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/70 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Network Address (Email)"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value); if(!isLogin) validateInput('email', e.target.value)}}
                  className={`w-full bg-gray-900/50 border-2 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all ${errors.email && !isLogin ? 'border-red-500' : 'border-purple-500/30 focus:border-fuchsia-500'}`}
                  required
                />
              </div>
              {!isLogin && errors.email && <p className="text-red-400 text-xs mt-1 ml-2">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/70 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Passkey (Password)"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full bg-gray-900/50 border-2 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all ${errors.password && !isLogin ? 'border-red-500' : 'border-purple-500/30 focus:border-fuchsia-500'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/70 hover:text-fuchsia-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && errors.password && <p className="text-red-400 text-xs mt-1 ml-2">{errors.password}</p>}
              {!isLogin && renderPasswordStrength()}
            </div>
            
            <Button
              type="submit"
              disabled={loading || (!isLogin && Object.keys(errors).length > 0)}
              className="w-full font-orbitron font-bold text-lg bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white py-3 rounded-lg shadow-[0_0_20px_rgba(192,132,252,0.4)] transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? 'Processing...' : (isLogin ? 'Engage' : 'Register')}
            </Button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({}); // Clear errors on view switch
              }}
              className="text-purple-300 hover:text-white text-sm font-medium transition-colors"
            >
              {isLogin ? "No account? Initiate registration." : "Existing protocol? Access gateway."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;