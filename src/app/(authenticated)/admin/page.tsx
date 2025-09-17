'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Header,
  HeaderActions,
  HeaderNotification,
  HeaderUser,
  StatsCard,
  Input,
  SessionCard,
  CreateSessionModal,
  Button,
  FryingPanLoading
} from '@/components';
import { useSessions } from '@/hooks/useSessions';
import { CreateSessionData } from '@/services/waha/sessions';

export default function AdminPage() {
  const [searchValue, setSearchValue] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  const { sessions, loading, error, createSession, startSession, stopSession, restartSession, logoutSession, deleteSession, getQRCode } = useSessions();

  // Filtro de sessões por nome
  const filteredSessions = useMemo(() => {
    if (!searchValue) return sessions;
    return sessions.filter(s =>
      (s?.name || '').toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [sessions, searchValue]);

  // Controlar o timing da animação de loading
  useEffect(() => {
    if (loading) {
      // Se está carregando, mostrar animação
      setShowLoadingAnimation(true);
    } else if (!loading) {
      // Quando terminar de carregar, aguardar 3 segundos antes de esconder a animação
      const timer = setTimeout(() => {
        setShowLoadingAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Função para criar nova sessão
  const handleCreateSession = async (data: CreateSessionData) => {
    try {
      await createSession(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  };


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        title="Dashboard"
        subtitle={`Bem-vindo(a), Admin. Gerenciar ${sessions.length} sessões WhatsApp`}
        onMenuToggle={() => {}}
        showMenuButton={true}
      >
        <HeaderActions>
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-800 dark:text-red-400 font-medium">Erro ao carregar sessões:</p>
              </div>
              <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          )}

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
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              <span className="text-sm font-normal">+</span>
              Nova Sessão
            </Button>
          </div>

          {/* Grid de Sessions (cards) */}
          {showLoadingAnimation ? (
            <div className="flex justify-center items-center py-16">
              <FryingPanLoading className="py-8" />
            </div>
          ) : filteredSessions.length > 0 ? (
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
