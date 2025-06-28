
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.editor': 'Editor',
    'nav.gallery': 'Gallery',
    'nav.pricing': 'Pricing',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'nav.settings': 'Settings',
    'nav.credits': 'Credits',
    'nav.darkMode': 'Dark Mode',
    'nav.lightMode': 'Light Mode',
    
    // Hero section
    'hero.title': 'Transform Your Photos with AI Magic',
    'hero.subtitle': 'Upload any image and watch our AI transform it into stunning artwork with professional styles and effects.',
    'hero.uploadButton': 'Upload & Transform',
    'hero.tryDemo': 'Try Demo',
    
    // Editor
    'editor.title': 'Create & Transform',
    'editor.subtitle': 'Edit your photos with AI-powered styles or generate stunning images from text descriptions',
    'editor.photoEditor': 'Photo Editor',
    'editor.textToImage': 'Text to Image',
    'editor.uploadPhoto': 'Upload Your Photo',
    'editor.transformedResult': 'Transformed Result',
    'editor.selectStyle': 'Select Style',
    'editor.transformImage': 'Transform Image',
    'editor.downloadResult': 'Download Result',
    'editor.transforming': 'Transforming...',
    'editor.aiWorking': 'AI is working its magic...',
    'editor.resultHere': 'Your transformed image will appear here',
    'editor.clickUpload': 'Click to upload your image',
    'editor.supportedFormats': 'Supports JPG, PNG, WebP up to 10MB',
    
    // Styles
    'style.artistic': 'Artistic',
    'style.vintage': 'Vintage',
    'style.modern': 'Modern',
    'style.abstract': 'Abstract',
    'style.fantasy': 'Fantasy',
    'style.professional': 'Professional',
  },
  fr: {
    // Navigation
    'nav.editor': 'Editeur',
    'nav.gallery': 'Galerie',
    'nav.pricing': 'Tarifs',
    'nav.signIn': 'Se connecter',
    'nav.signOut': 'Se déconnecter',
    'nav.settings': 'Paramètres',
    'nav.credits': 'Crédits',
    'nav.darkMode': 'Mode sombre',
    'nav.lightMode': 'Mode clair',
    
    // Hero section
    'hero.title': 'Transformez vos photos avec la magie de l\'IA',
    'hero.subtitle': 'Téléchargez n\'importe quelle image et regardez notre IA la transformer en œuvre d\'art époustouflante avec des styles et effets professionnels.',
    'hero.uploadButton': 'Télécharger et transformer',
    'hero.tryDemo': 'Essayer la démo',
    
    // Editor
    'editor.title': 'Créer et transformer',
    'editor.subtitle': 'Modifiez vos photos avec des styles alimentés par l\'IA ou générez des images époustouflantes à partir de descriptions textuelles',
    'editor.photoEditor': 'Éditeur de photos',
    'editor.textToImage': 'Texte vers image',
    'editor.uploadPhoto': 'Téléchargez votre photo',
    'editor.transformedResult': 'Résultat transformé',
    'editor.selectStyle': 'Sélectionner le style',
    'editor.transformImage': 'Transformer l\'image',
    'editor.downloadResult': 'Télécharger le résultat',
    'editor.transforming': 'Transformation...',
    'editor.aiWorking': 'L\'IA travaille sa magie...',
    'editor.resultHere': 'Votre image transformée apparaîtra ici',
    'editor.clickUpload': 'Cliquez pour télécharger votre image',
    'editor.supportedFormats': 'Prend en charge JPG, PNG, WebP jusqu\'à 10 Mo',
    
    // Styles
    'style.artistic': 'Artistique',
    'style.vintage': 'Vintage',
    'style.modern': 'Moderne',
    'style.abstract': 'Abstrait',
    'style.fantasy': 'Fantaisie',
    'style.professional': 'Professionnel',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
