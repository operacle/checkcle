
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, LogIn, Settings, AlertCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { API_ENDPOINTS, getCurrentEndpoint, setApiEndpoint } from '@/lib/pocketbase';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState(getCurrentEndpoint());
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Add responsiveness check
  const [isMobile, setIsMobile] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(''); // Clear previous errors

    try {
      await authService.login({ email, password });
      toast({
        title: t("loginSuccessful"),
        description: t("loginSuccessMessage"),
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error details:", error);
      
      // Set specific error message based on the error
      if (error instanceof Error) {
        if (error.message.includes('Failed to authenticate') || 
            error.message.includes('Authentication failed') ||
            error.message.includes('Invalid credentials') ||
            error.message.includes('invalid email or password')) {
          setLoginError(t("invalidCredentials"));
        } else {
          setLoginError(error.message);
        }
      } else {
        setLoginError(`${t("authenticationFailed")}. Server: ${currentEndpoint}`);
      }
      
      toast({
        variant: "destructive",
        title: t("loginFailed"),
        description: error instanceof Error 
          ? (error.message.includes('Failed to authenticate') || 
             error.message.includes('Authentication failed') ||
             error.message.includes('Invalid credentials') ||
             error.message.includes('invalid email or password')) 
            ? t("invalidCredentials")
            : error.message
          : `${t("authenticationFailed")}. Server: ${currentEndpoint}`,
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-6 rounded-xl bg-card shadow-xl border border-border/20">
        <div className="text-center relative">
          {/* Commented out API Endpoint Settings button
          <div className="absolute right-0 top-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="API Settings">
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
                      <Label htmlFor="local" className="truncate text-sm">Local: {API_ENDPOINTS.LOCAL}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={API_ENDPOINTS.REMOTE} id="remote" />
                      <Label htmlFor="remote" className="truncate text-sm">Remote: {API_ENDPOINTS.REMOTE}</Label>
                    </div>
                  </RadioGroup>
                  <div className="text-xs text-muted-foreground truncate">
                    Current endpoint: {currentEndpoint}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          */}
          
          {/* Logo */}
          <div className="mb-4">
            <img 
              src="/checkcle_logo.svg" 
              alt="CheckCle Logo" 
              className="mx-auto h-16 w-auto"
            />
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{t("signInToYourAccount")}</h1>
          {/* Removed "Don't have an account? Create one" text */}
        </div>

        {/* Removed Google Sign in button section */}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Error Alert */}
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground" htmlFor="email">{t("email")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                placeholder="your.email@provider.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError(''); // Clear error when user starts typing
                }}
                required
                className="pl-10 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-foreground" htmlFor="password">{t("password")}</label>
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs sm:text-sm text-emerald-500 hover:text-emerald-400"
              >
                {t("forgot")}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <Input
                id="password"
                placeholder="••••••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(''); // Clear error when user starts typing
                }}
                required
                className="pl-10 text-sm sm:text-base h-9 sm:h-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-2 sm:py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? t("signingIn") : t("signIn")}
            {!loading && <LogIn className="ml-2 h-4 w-4" />}
          </Button>

          <p className="text-xxs sm:text-xs text-center text-muted-foreground">
            {t("bySigningIn")} <a href="#" className="text-emerald-500">{t("termsAndConditions")}</a> {t("and")} <a href="#" className="text-emerald-500">{t("privacyPolicy")}</a>.
          </p>
        </form>
      </div>

      <ForgotPasswordDialog 
        open={showForgotPassword} 
        onOpenChange={setShowForgotPassword} 
      />
    </div>
  );
};

export default Login;