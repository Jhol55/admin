'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SessionResponse } from '@/services/waha/sessions';
import { Card, CardHeader, CardContent, StatusBadge } from './index';

interface SessionCardProps {
    session: SessionResponse;
    onStart: (name: string) => void;
    onStop: (name: string) => void;
    onRestart: (name: string) => void;
    onLogout: (name: string) => void;
    onDelete: (name: string) => void;
    onGetQRCode: (name: string) => Promise<string | null>;
    loading?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
    session,
    onStart,
    onStop,
    onRestart,
    onLogout,
    onDelete,
    onGetQRCode,
    loading = false
}) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'WORKING':
                return <StatusBadge status="active" size="xs" />;
            case 'SCAN_QR_CODE':
                return <StatusBadge status="pending" size="xs" />;
            case 'FAILED':
                return <StatusBadge status="failed" size="xs" />;
            case 'STOPPED':
                return <StatusBadge status="inactive" size="xs" />;
            case 'STARTING':
                return <StatusBadge status="pending" size="xs" />;
            default:
                return <StatusBadge status="pending" size="xs" />;
        }
    };

    const handleShowQR = async () => {
        if (qrCode) {
            setShowQRModal(true);
            return;
        }

        setQrLoading(true);
        try {
            // Se o status não for SCAN_QR_CODE, primeiro iniciar a sessão
            if (session.status !== 'SCAN_QR_CODE') {
                console.log('Iniciando sessão para gerar QR code...');
                if (session.status === 'STOPPED') {
                    onStart(session.name);
                }
                if (session.status === 'FAILED') {
                    onRestart(session.name);
                }
                // Aguardar um pouco para a sessão iniciar
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Usar o hook para gerar o QR code
            const qr = await onGetQRCode(session.name);
            if (qr) {
                setQrCode(qr);
                setShowQRModal(true);
            } else {
                console.error('Erro ao gerar QR code');
                // Se falhar, tentar novamente após mais um tempo
                setTimeout(async () => {
                    try {
                        const retryQr = await onGetQRCode(session.name);
                        if (retryQr) {
                            setQrCode(retryQr);
                            setShowQRModal(true);
                        }
                    } catch (retryError) {
                        console.error('Erro ao tentar gerar QR code novamente:', retryError);
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('Error fetching QR code:', error);
        } finally {
            setQrLoading(false);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {session.name}
                    </h3>
                    {getStatusBadge(session.status)}
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    {/* Ícone, PushName e Número */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            {session.me?.pushName ? (
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {session.me.pushName}
                                </p>
                            ) : (
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Número não conectado
                                </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {session.me?.id.split('@')[0]}
                            </p>
                        </div>
                    </div>

                    {/* Webhook */}
                    {session.webhook && (
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Webhook</p>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-700 dark:text-gray-300 break-all">
                                {session.webhook}
                            </p>
                        </div>
                    )}

                    {/* Ações */}
                    <div className="flex justify-center gap-2 pt-2">
                        {session.status === 'STARTING' ? (
                            // Quando está iniciando - mostrar loading
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Iniciando...</span>
                            </div>
                        ) : !session.me ? (
                            // Quando não há 'me' e não está iniciando - apenas QR Code e Deletar
                            <>
                                <button
                                    onClick={handleShowQR}
                                    disabled={qrLoading}
                                    className="w-9 h-9 rounded-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
                                    title={session.status === 'SCAN_QR_CODE' ? 'Gerar QR Code' : 'Iniciar e Gerar QR Code'}
                                >
                                    {qrLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                    )}
                                </button>
                                
                                <button
                                    onClick={() => onDelete(session.name)}
                                    disabled={loading}
                                    className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
                                    title="Deletar sessão"
                                >
                                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        <rect x="8" y="9" width="8" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </>
                        ) : (
                            // Quando há 'me' - todos os botões normais
                            <>
                                {session.status === 'STOPPED' ? (
                                    <button
                                        onClick={() => onStart(session.name)}
                                        disabled={loading}
                                        className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
                                        title="Iniciar sessão"
                                    >
                                        <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onStop(session.name)}
                                        disabled={loading}
                                        className="w-9 h-9 rounded-full bg-gray-500 hover:bg-gray-600 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
                                        title="Pausar sessão"
                                    >
                                        <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 6h12v12H6z"/>
                                        </svg>
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => onRestart(session.name)}
                                    disabled={loading}
                                    className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
                                    title="Reiniciar sessão"
                                >
                                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                                
                                <button
                                    onClick={() => onLogout(session.name)}
                                    disabled={loading}
                                    className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
                                    title="Desconectar sessão"
                                >
                                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                                
                                <button
                                    onClick={() => onDelete(session.name)}
                                    disabled={loading}
                                    className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
                                    title="Deletar sessão"
                                >
                                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        <rect x="8" y="9" width="8" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Modal do QR Code */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {session.name}
                            </h3>
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {qrCode ? (
                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Escaneie o QR Code com seu WhatsApp para conectar
                                </p>
                                <div className="flex justify-center">
                                    <Image 
                                        src={qrCode} 
                                        alt="QR Code" 
                                        width={256}
                                        height={256}
                                        className="w-64 h-64 border border-gray-200 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                                    O QR Code expira em alguns minutos
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Gerando QR Code...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default SessionCard;
