'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '@/lib/types';
import defaultSiteContent from '../../data/site-content.json';

const fallbackContent = defaultSiteContent as unknown as SiteContent;

interface SiteContentContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  saveToServer: () => Promise<boolean>;
  resetToDefault: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  selectedPreviewPage: string;
  setSelectedPreviewPage: (page: string) => void;
  themeMode: 'light' | 'dark';
  toggleThemeMode: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({
  initialContent,
  children,
}: {
  initialContent: SiteContent;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent || fallbackContent);
  const [originalContent, setOriginalContent] = useState<SiteContent>(initialContent || fallbackContent);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedPreviewPage, setSelectedPreviewPage] = useState<string>('home');
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>('dark');

  // Initialize theme mode from localStorage or initial content
  useEffect(() => {
    const stored = localStorage.getItem('glx_theme_mode') as 'light' | 'dark' | null;
    if (stored === 'light' || stored === 'dark') {
      setThemeModeState(stored);
      applyThemeClass(stored);
    } else {
      const defaultM = initialContent?.theme?.defaultMode || 'dark';
      setThemeModeState(defaultM);
      applyThemeClass(defaultM);
    }
  }, [initialContent]);

  const applyThemeClass = (mode: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const setThemeMode = (mode: 'light' | 'dark') => {
    setThemeModeState(mode);
    localStorage.setItem('glx_theme_mode', mode);
    applyThemeClass(mode);
  };

  const toggleThemeMode = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
  };

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
      setOriginalContent(initialContent);
    }
  }, [initialContent]);

  // Apply custom CSS variable branding
  useEffect(() => {
    if (content?.theme && typeof document !== 'undefined') {
      const root = document.documentElement;
      if (content.theme.primaryColor) {
        root.style.setProperty('--brand-900', content.theme.primaryColor);
        root.style.setProperty('--brand-800', content.theme.primaryColor);
        root.style.setProperty('--brand-700', content.theme.primaryHover || content.theme.primaryColor);
      }
      if (content.theme.accentColor) {
        root.style.setProperty('--accent-500', content.theme.accentColor);
        root.style.setProperty('--accent-600', content.theme.accentHover || content.theme.accentColor);
      }
    }
  }, [content?.theme]);

  const updateContent = (newPartial: Partial<SiteContent>) => {
    setContent((prev) => {
      const merged = { ...prev, ...newPartial };
      return merged;
    });
    setHasUnsavedChanges(true);
  };

  const saveToServer = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setOriginalContent(content);
        setHasUnsavedChanges(false);
        setIsSaving(false);
        return true;
      }
      setIsSaving(false);
      return false;
    } catch (err) {
      console.error('Failed to save site content:', err);
      setIsSaving(false);
      return false;
    }
  };

  const resetToDefault = () => {
    setContent(originalContent);
    setHasUnsavedChanges(false);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateContent,
        saveToServer,
        resetToDefault,
        isSaving,
        hasUnsavedChanges,
        selectedPreviewPage,
        setSelectedPreviewPage,
        themeMode,
        toggleThemeMode,
        setThemeMode,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    return {
      content: fallbackContent,
      updateContent: () => {},
      saveToServer: async () => false,
      resetToDefault: () => {},
      isSaving: false,
      hasUnsavedChanges: false,
      selectedPreviewPage: 'home',
      setSelectedPreviewPage: () => {},
      themeMode: 'dark' as const,
      toggleThemeMode: () => {},
      setThemeMode: () => {},
    };
  }
  return context;
}
