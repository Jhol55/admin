'use client';

import React, { useState } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { CreateSessionData } from '@/services/waha/sessions';
import { Button, Card, CardHeader, CardContent, Input, StatusBadge } from './index';

export const SessionsManager: React.FC = () => {
    const { sessions, loading, error, createSession, startSession, stopSession, deleteSession } = useSessions();
    const [newSessionName, setNewSessionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateSession = async () => {
        if (!newSessionName.trim()) return;
        
        setIsCreating(true);
        const data: CreateSessionData = {
            name: newSessionName.trim(),
            webhook: 'https://your-webhook-url.com/webhook'
        };
        
        const result = await createSession(data);
        if (result) {
            setNewSessionName('');
        }
        setIsCreating(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'WORKING':
                return <StatusBadge status="active" size="sm" />;
            case 'SCAN_QR_CODE':
                return <StatusBadge status="pending" size="sm" />;
            case 'FAILED':
                return <StatusBadge status="failed" size="sm" />;
            case 'STOPPED':
                return <StatusBadge status="inactive" size="sm" />;
            default:
                return <StatusBadge status="pending" size="sm" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    if (loading && sessions.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando sessões...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Create New Session */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Nova Sessão WhatsApp
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="Nome da sessão"
                            value={newSessionName}
                            onChange={(e) => setNewSessionName(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleCreateSession}
                            loading={isCreating}
                            disabled={!newSessionName.trim()}
                        >
                            Criar Sessão
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <Card>
                    <CardContent>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-800 dark:text-red-400">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Sessions List */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Sessões Ativas ({sessions.length})
                    </h3>
                </CardHeader>
                <CardContent>
                    {sessions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhuma sessão encontrada
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {session.name}
                                            </h4>
                                            {getStatusBadge(session.status)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            <p>ID: {session.id}</p>
                                            <p>Criado em: {formatDate(session.createdAt)}</p>
                                            {session.webhook && (
                                                <p>Webhook: {session.webhook}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {session.status === 'STOPPED' ? (
                                            <Button
                                                size="sm"
                                                onClick={() => startSession(session.id)}
                                                loading={loading}
                                            >
                                                Iniciar
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => stopSession(session.id)}
                                                loading={loading}
                                            >
                                                Parar
                                            </Button>
                                        )}
                                        
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => deleteSession(session.id)}
                                            loading={loading}
                                        >
                                            Deletar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SessionsManager;
