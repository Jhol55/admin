'use client';

import React, { useState } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  children?: React.ReactNode;
  className?: string;
}

interface HeaderActionsProps {
  children: React.ReactNode;
  className?: string;
}

interface HeaderUserProps {
  name?: string;
  email?: string;
  avatar?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

interface HeaderNotificationProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
};

export const HeaderNotification: React.FC<HeaderNotificationProps> = ({
  count = 0,
  onClick,
  className = ''
}) => {
  const bellIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 2a7 7 0 00-7 7v3.586l-1.293 1.293A1 1 0 004 14h16a1 1 0 00.707-1.707L19 12.586V9a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 ${className}`}
    >
      {bellIcon}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export const HeaderUser: React.FC<HeaderUserProps> = ({
  name = "Admin User",
  email = "admin@example.com",
  avatar,
  onProfileClick,
  onLogoutClick,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const userIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const chevronIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            {userIcon}
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
        </div>
        <span className="text-gray-400">{chevronIcon}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  onProfileClick?.();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  onLogoutClick?.();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onMenuToggle,
  showMenuButton = true,
  children,
  className = ''
}) => {
  const menuIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  return (
    <header className={`bg-[var(--card-bg)] border-b border-[var(--card-border)] shadow-[var(--shadow-sm)] px-8 py-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              {menuIcon}
            </button>
          )}
          
          {title && (
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base text-[var(--muted)] font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {children && (
          <div className="flex items-center gap-4">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
