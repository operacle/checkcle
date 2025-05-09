
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Mail, LogIn, Settings } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { API_ENDPOINTS, getCurrentEndpoint, setApiEndpoint } from '@/lib/pocketbase';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState(getCurrentEndpoint());
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

    try {
      await authService.login({ email, password });
      toast({
        title: t("loginSuccessful"),
        description: t("loginSuccessMessage"),
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error details:", error);
      toast({
        variant: "destructive",
        title: t("loginFailed"),
        description: error instanceof Error 
          ? error.message 
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
          <div className="absolute right-0 top-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="API Settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            {/*   <PopoverContent className="w-[260px] sm:w-80">   //this allow test api connection in login page
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
              </PopoverContent> */}
            </Popover>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{t("signInToYourAccount")}</h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            {t("dontHaveAccount")} <a href="#" className="font-medium text-emerald-500 hover:text-emerald-400">{t("createOne")}</a>
          </p>
        </div>

        <div>
          <Button
            variant="outline"
            className="w-full py-4 sm:py-6 flex items-center justify-center gap-2 bg-background"
            disabled={loading}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm sm:text-base">{t("signInWithGoogle")}</span>
          </Button>

          <div className="mt-4 sm:mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-card text-muted-foreground">{t("orContinueWith")}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-foreground" htmlFor="password">{t("password")}</label>
              <a href="#" className="text-xs sm:text-sm text-emerald-500 hover:text-emerald-400">{t("forgot")}</a>
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
                onChange={(e) => setPassword(e.target.value)}
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
    </div>
  );
};

export default Login;
