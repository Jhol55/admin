'use client';

import { useState, useEffect, useCallback } from 'react';
import { SessionResponse, CreateSessionData } from '@/services/waha/sessions';

interface UseSessionsReturn {
    sessions: SessionResponse[];
    loading: boolean;
    error: string | null;
    createSession: (data: CreateSessionData) => Promise<SessionResponse | null>;
    startSession: (name: string) => Promise<SessionResponse | null>;
    stopSession: (name: string) => Promise<SessionResponse | null>;
    restartSession: (name: string) => Promise<SessionResponse | null>;
    logoutSession: (name: string) => Promise<SessionResponse | null>;
    deleteSession: (name: string) => Promise<boolean>;
    getQRCode: (name: string) => Promise<string | null>;
    refreshSessions: () => Promise<void>;
}

export const useSessions = (): UseSessionsReturn => {
    const [sessions, setSessions] = useState<SessionResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/waha/sessions');
            
            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }
            
            const data = await response.json();
            setSessions(Array.isArray(data) ? data : data.sessions || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    const createSession = useCallback(async (data: CreateSessionData): Promise<SessionResponse | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/waha/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create session');
            }
            
            const newSession = await response.json();
            setSessions(prev => [...prev, newSession]);
            return newSession;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const startSession = useCallback(async (name: string): Promise<SessionResponse | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/waha/sessions/${name}/start`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error('Failed to start session');
            }
            
            const updatedSession = await response.json();
            setSessions(prev => 
                prev.map(session => 
                    session.name === name ? updatedSession : session
                )
            );
            
            // Polling para atualizar o status automaticamente
            const pollStatus = async () => {
                let attempts = 0;
                const maxAttempts = 30; // 30 tentativas = 30 segundos
                
                const poll = async () => {
                    try {
                        const pollResponse = await fetch(`/api/waha/sessions/${name}`);
                        if (pollResponse.ok) {
                            const sessionData = await pollResponse.json();
                            setSessions(prev => 
                                prev.map(session => 
                                    session.name === name ? sessionData : session
                                )
                            );
                            
                            // Se não está mais STARTING, para o polling
                            if (sessionData.status !== 'STARTING') {
                                return;
                            }
                        }
                        
                        attempts++;
                        if (attempts < maxAttempts) {
                            setTimeout(poll, 1000); // Poll a cada 1 segundo
                        }
                    } catch (error) {
                        console.error('Error polling session status:', error);
                    }
                };
                
                // Inicia o polling após 1 segundo
                setTimeout(poll, 1000);
            };
            
            pollStatus();
            
            return updatedSession;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const stopSession = useCallback(async (name: string): Promise<SessionResponse | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/waha/sessions/${name}/stop`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error('Failed to stop session');
            }
            
            const updatedSession = await response.json();
            setSessions(prev => 
                prev.map(session => 
                    session.name === name ? updatedSession : session
                )
            );
            return updatedSession;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const restartSession = useCallback(async (name: string): Promise<SessionResponse | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/waha/sessions/${name}/restart`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error('Failed to restart session');
            }
            
            const updatedSession = await response.json();
            setSessions(prev => 
                prev.map(session => 
                    session.name === name ? updatedSession : session
                )
            );
            
            // Polling para atualizar o status automaticamente
            const pollStatus = async () => {
                let attempts = 0;
                const maxAttempts = 30; // 30 tentativas = 30 segundos
                
                const poll = async () => {
                    try {
                        const pollResponse = await fetch(`/api/waha/sessions/${name}`);
                        if (pollResponse.ok) {
                            const sessionData = await pollResponse.json();
                            setSessions(prev => 
                                prev.map(session => 
                                    session.name === name ? sessionData : session
                                )
                            );
                            
                            // Se não está mais STARTING, para o polling
                            if (sessionData.status !== 'STARTING') {
                                return;
                            }
                        }
                        
                        attempts++;
                        if (attempts < maxAttempts) {
                            setTimeout(poll, 1000); // Poll a cada 1 segundo
                        }
                    } catch (error) {
                        console.error('Error polling session status:', error);
                    }
                };
                
                // Inicia o polling após 1 segundo
                setTimeout(poll, 1000);
            };
            
            pollStatus();
            
            return updatedSession;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const logoutSession = useCallback(async (name: string): Promise<SessionResponse | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/waha/sessions/${name}/logout`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error('Failed to logout session');
            }
            
            const updatedSession = await response.json();
            setSessions(prev => 
                prev.map(session => 
                    session.name === name ? updatedSession : session
                )
            );
            return updatedSession;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteSession = useCallback(async (name: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/waha/sessions/${name}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete session');
            }
            
            setSessions(prev => prev.filter(session => session.name !== name));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getQRCode = useCallback(async (name: string): Promise<string | null> => {
        try {
            const response = await fetch(`/api/waha/auth/${name}/qr`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch QR code');
            }
            
            // A API retorna uma imagem PNG diretamente, não JSON
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        }
    }, []);

    const refreshSessions = useCallback(async () => {
        await fetchSessions();
    }, [fetchSessions]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return {
        sessions,
        loading,
        error,
        createSession,
        startSession,
        stopSession,
        restartSession,
        logoutSession,
        deleteSession,
        getQRCode,
        refreshSessions,
    };
};
