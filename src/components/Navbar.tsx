
import React, { useState } from 'react';
import { User, Settings, LogOut, LogIn, Menu, X, Calendar, Cloud, Moon, Sun, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out."
      });
      navigateTo('/');
    }
    setIsMobileMenuOpen(false);
  };

  const navigateTo = (path: string, hash?: string) => {
    if (hash) {
      navigate(path);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('/')}>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StyleShift AI
              </h1>
            </div>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigateTo('/', 'upload-section')} 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                {t('nav.upload')}
              </button>
              <button 
                onClick={() => navigateTo('/gallery')} 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                {t('nav.gallery')}
              </button>
              <button 
                onClick={() => navigateTo('/', 'pricing')} 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                {t('nav.pricing')}
              </button>
            </div>
            
            {/* User Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Globe className="w-4 h-4 mr-1" />
                {language.toUpperCase()}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              
              {user ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{t('nav.credits')}:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">{profile?.credits || 0}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {profile?.username || user.email?.split('@')[0]}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigateTo('/auth')}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('nav.signIn')}
                </Button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI PhotoCraft</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)} className="dark:text-gray-300">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {user && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {profile?.username || user.email?.split('@')[0]}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{t('nav.credits')}:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">{profile?.credits || 0}</span>
                  </div>
                </div>
              )}
              
              <nav className="space-y-2">
                <button 
                  onClick={() => navigateTo('/', 'upload-section')}
                  className="w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t('nav.upload')}
                </button>
                <button 
                  onClick={() => navigateTo('/gallery')}
                  className="w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('nav.gallery')}
                </button>
                <button 
                  onClick={() => navigateTo('/', 'pricing')}
                  className="w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t('nav.pricing')}
                </button>
              </nav>
              
              <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Français' : 'English'}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                  {theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')}
                </Button>
              </div>
              
              {user ? (
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    {t('nav.settings')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.signOut')}
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t dark:border-gray-700">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => navigateTo('/auth')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('nav.signIn')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
