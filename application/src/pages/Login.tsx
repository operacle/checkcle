import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, LogIn, Settings, AlertCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { API_ENDPOINTS, getCurrentEndpoint, setApiEndpoint } from '@/lib/pocketbase';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface LoginAttempts {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState(getCurrentEndpoint());
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempts>({ count: 0, lastAttempt: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Load login attempts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('login_attempts');
    if (stored) {
      try {
        const attempts: LoginAttempts = JSON.parse(stored);
        setLoginAttempts(attempts);
        
        if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
          setIsLocked(true);
          setLockoutTimeRemaining(Math.ceil((attempts.lockedUntil - Date.now()) / 1000));
        }
      } catch {
        localStorage.removeItem('login_attempts');
      }
    }
  }, []);

  // Update lockout timer
  useEffect(() => {
    if (isLocked && lockoutTimeRemaining > 0) {
      const timer = setInterval(() => {
        setLockoutTimeRemaining(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts({ count: 0, lastAttempt: 0 });
            localStorage.removeItem('login_attempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTimeRemaining]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6; // Minimum 6 characters
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("emailInvalid");
    }

    if (!password) {
      newErrors.password = t("passwordRequired");
    } else if (!validatePassword(password)) {
      newErrors.password = t("passwordTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateLoginAttempts = useCallback((failed: boolean) => {
    const now = Date.now();
    
    if (failed) {
      const newCount = loginAttempts.count + 1;
      let newAttempts: LoginAttempts = {
        count: newCount,
        lastAttempt: now
      };

      if (newCount >= MAX_LOGIN_ATTEMPTS) {
        newAttempts.lockedUntil = now + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutTimeRemaining(LOCKOUT_DURATION / 1000);
      }

      setLoginAttempts(newAttempts);
      localStorage.setItem('login_attempts', JSON.stringify(newAttempts));
    } else {
      // Reset on successful login
      setLoginAttempts({ count: 0, lastAttempt: 0 });
      localStorage.removeItem('login_attempts');
    }
  }, [loginAttempts.count]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        variant: "destructive",
        title: t("accountLocked"),
        description: t("tooManyAttempts"),
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authService.login({ email: email.toLowerCase().trim(), password });
      
      updateLoginAttempts(false);
      
      toast({
        title: t("loginSuccessful"),
        description: t("loginSuccessMessage"),
      });
      
      navigate('/dashboard');
    } catch (error) {
      updateLoginAttempts(true);
      
      // Generic error message for security
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - (loginAttempts.count + 1);
      let errorMessage = t("invalidCredentials");
      
      if (remainingAttempts > 0 && remainingAttempts <= 2) {
        errorMessage += ` ${t("attemptsRemaining")}: ${remainingAttempts}`;
      }

      setErrors({ general: errorMessage });
      
      toast({
        variant: "destructive",
        title: t("loginFailed"),
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndpointChange = (value: string) => {
    setCurrentEndpoint(value);
    setApiEndpoint(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formatLockoutTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-6 rounded-xl bg-card shadow-xl border border-border/20">
        <div className="text-center relative">
          {/* API Endpoint Settings - Only show in development */}
          {/*isDevelopment && (
            <div className="absolute right-0 top-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px] sm:w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">API Endpoint Settings</h4>
                    <RadioGroup
                      value={currentEndpoint}
                      onValueChange={handleEndpointChange}
                      className="gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={API_ENDPOINTS.LOCAL} id="local" />
                        <Label htmlFor="local" className="truncate text-sm">
                          Local: {API_ENDPOINTS.LOCAL}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={API_ENDPOINTS.REMOTE} id="remote" />
                        <Label htmlFor="remote" className="truncate text-sm">
                          Remote: {API_ENDPOINTS.REMOTE}
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="text-xs text-muted-foreground truncate">
                      Current: {currentEndpoint}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )*/} 

          {/* Logo */}
          <img 
            src="/checkcle_logo.svg" 
            alt="Checkcle Logo" 
            className="h-16 sm:h-20 mx-auto mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t("signInToYourAccount")}
          </h1>
          
          {isLocked && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {t("accountLocked")} - {formatLockoutTime(lockoutTimeRemaining)}
                </span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.general}</span>
              </div>
            </div>
          )}

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">
              {t("email")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                name="email"
                placeholder="your.email@provider.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                required
                autoComplete="email"
                disabled={loading || isLocked}
                className={`pl-10 text-sm sm:text-base h-9 sm:h-10 ${
                  errors.email ? 'border-destructive focus:border-destructive' : ''
                }`}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium text-foreground">
                {t("password")}
              </label>
              <a 
                href="#" 
                className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                {t("forgot")}
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="text-muted-foreground">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="••••••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                required
                autoComplete="current-password"
                disabled={loading || isLocked}
                className={`pl-10 pr-10 text-sm sm:text-base h-9 sm:h-10 ${
                  errors.password ? 'border-destructive focus:border-destructive' : ''
                }`}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
                disabled={loading || isLocked}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2 sm:py-6 font-medium text-sm sm:text-base"
            disabled={loading || isLocked}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                {t("signingIn")}
              </>
            ) : (
              <>
                {t("signIn")}
                <LogIn className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-xs sm:text-xs text-center text-muted-foreground">
            {t("bySigningIn")} <a href="#" className="text-primary hover:text-primary/80">{t("termsAndConditions")}</a> {t("and")} <a href="#" className="text-primary hover:text-primary/80">{t("privacyPolicy")}</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
