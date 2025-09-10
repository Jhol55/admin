'use client';

import React, { useState, useMemo } from 'react';
import {
  Sidebar,
  SidebarItem,
  Header,
  HeaderActions,
  HeaderSearch,
  HeaderNotification,
  HeaderUser,
  StatsCard,
  Input,
  SessionCard,
  CreateSessionModal
} from '@/components';
import { useSessions } from '@/hooks/useSessions';
import { CreateSessionData } from '@/services/waha/sessions/sessions';

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { sessions, loading, createSession, startSession, stopSession, restartSession, logoutSession, deleteSession, getQRCode } = useSessions();

  // Filtro de sessões por nome
  const filteredSessions = useMemo(() => {
    if (!searchValue) return sessions;
    return sessions.filter(s =>
      (s?.name || '').toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [sessions, searchValue]);

  // Função para criar nova sessão
  const handleCreateSession = async (data: CreateSessionData) => {
    try {
      await createSession(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  };

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={handleMenuToggle}>
        <SidebarItem
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          }
          label="Dashboard"
          isActive={true}
          onClick={() => {}}
        />
        <SidebarItem
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          label="Analytics"
        />
        <SidebarItem
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          }
          label="Settings"
        />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          title="Dashboard"
          subtitle={`Bem-vindo(a), Admin. Gerenciar ${sessions.length} sessões WhatsApp`}
          onMenuToggle={handleMenuToggle}
          showMenuButton={true}
        >
          <HeaderActions>
            <HeaderSearch
              placeholder="Search..."
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              className="w-64"
            />
            <HeaderNotification count={3} />
            <HeaderUser
              name="Admin User"
              email="admin@example.com"
              onProfileClick={() => console.log('Profile clicked')}
              onLogoutClick={() => console.log('Logout clicked')}
            />
          </HeaderActions>
        </Header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total de sessões"
                value={sessions.length}
                icon={
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
              />
              <StatsCard
                title="Sessões ativas"
                value={sessions.filter(s => s.status === 'WORKING').length}
                icon={
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard
                title="Sessões paradas"
                value={sessions.filter(s => s.status === 'STOPPED').length}

                icon={
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                }
              />
              <StatsCard
                title="Sessões com erro"
                value={sessions.filter(s => s.status === 'FAILED').length}
                icon={
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                }
              />
            </div>

            {/* Barra de busca e botão Nova Sessão */}
            <div className="flex items-center gap-4 mb-2">
              <Input
                className="w-full md:w-80"
                placeholder="Buscar sessões..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap"
              >
                <span className="text-sm font-normal">+</span>
                Nova Sessão
              </button>
            </div>

            {/* Grid de Sessions (cards) */}
            {filteredSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onStart={startSession}
                    onStop={stopSession}
                    onRestart={restartSession}
                    onLogout={logoutSession}
                    onDelete={deleteSession}
                    onGetQRCode={getQRCode}
                    loading={loading}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhuma sessão encontrada.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Criação de Sessão */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSession={handleCreateSession}
        loading={loading}
      />
    </div>
  );
}
