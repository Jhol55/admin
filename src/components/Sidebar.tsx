'use client';

import React, { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  className?: string;
}

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive = false,
  onClick,
  badge
}) => {
  const baseClasses = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50";
  const activeClasses = isActive 
    ? "bg-purple-100 text-[var(--primary)]" 
    : "text-gray-700";

  const content = (
    <>
      {icon && <span className="flex-shrink-0 w-5 h-5">{icon}</span>}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${activeClasses}`}>
        {content}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} w-full text-left`}
    >
      {content}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onToggle,
  children,
  className = ""
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleThemeToggle = () => setIsDark((v) => !v);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[var(--card-bg)] border-r border-[var(--sidebar-border)] shadow-[var(--shadow-sm)]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--sidebar-border)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-[var(--foreground)]">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full hover:bg-[var(--sidebar-active)] transition-colors"
                aria-label="Alternar tema"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71m16.97-2.12l-.71-.71M4.05 4.05l-.71-.71M21 12h1M3 12H2m16.24 4.24l-.71-.71M6.34 6.34l-.71-.71" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                )}
              </button>
              <button
                onClick={onToggle}
                className="lg:hidden p-1 rounded-md hover:bg-[var(--sidebar-active)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {children}
          </nav>     
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
