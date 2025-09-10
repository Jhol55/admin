import React, { useState } from 'react';
import { CreateSessionData } from '@/services/waha/sessions/sessions';
import { Button } from './Button';
import { Input } from './Input';

interface CreateSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSession: (data: CreateSessionData) => void;
    loading?: boolean;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
    isOpen,
    onClose,
    onCreateSession,
    loading = false
}) => {
    const [formData, setFormData] = useState<CreateSessionData>({
        name: '',
        start: true,
        config: {
            metadata: {},
            proxy: null,
            debug: false,
            ignore: {
                status: null,
                groups: null,
                channels: null
            },
            noweb: {
                store: {
                    enabled: true,
                    fullSync: false
                }
            },
            webjs: {
                tagsEventsOn: false
            },
            webhooks: [{
                url: '',
                events: ['message', 'session.status'],
                hmac: null,
                retries: null,
                customHeaders: null
            }]
        }
    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateSession(formData);
    };

    const handleInputChange = (path: string, value: string | boolean | null | string[]) => {
        setFormData(prev => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current: Record<string, unknown> = newData;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]] as Record<string, unknown>;
            }
            
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const addMetadata = () => {
        setFormData(prev => ({
            ...prev,
            config: {
                ...prev.config,
                metadata: {
                    ...prev.config.metadata,
                    [`key_${Date.now()}`]: ''
                }
            }
        }));
    };

    const removeMetadata = (key: string) => {
        setFormData(prev => {
            const newMetadata = { ...prev.config.metadata };
            delete newMetadata[key];
            return {
                ...prev,
                config: {
                    ...prev.config,
                    metadata: newMetadata
                }
            };
        });
    };

    const updateMetadataKey = (oldKey: string, newKey: string) => {
        setFormData(prev => {
            const newMetadata = { ...prev.config.metadata };
            const value = newMetadata[oldKey];
            delete newMetadata[oldKey];
            newMetadata[newKey] = value;
            return {
                ...prev,
                config: {
                    ...prev.config,
                    metadata: newMetadata
                }
            };
        });
    };

    const addWebhook = () => {
        setFormData(prev => ({
            ...prev,
            config: {
                ...prev.config,
                webhooks: [
                    ...(prev.config.webhooks || []),
                    {
                        url: '',
                        events: ['message', 'session.status'],
                        hmac: null,
                        retries: null,
                        customHeaders: null
                    }
                ]
            }
        }));
    };

    const removeWebhook = (index: number) => {
        setFormData(prev => ({
            ...prev,
            config: {
                ...prev.config,
                webhooks: prev.config.webhooks?.filter((_, i) => i !== index) || []
            }
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-semibold text-white">
                        Criar Nova Sessão
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {/* Nome da Sessão */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Nome da Sessão *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Ex: default, user_123"
                                    required
                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Start Automático */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="start"
                                    checked={formData.start}
                                    onChange={(e) => handleInputChange('start', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor="start" className="text-sm text-gray-300">
                                    Iniciar sessão automaticamente
                                </label>
                            </div>

                            {/* Metadata */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-white">Metadata</h3>
                                        <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-white">i</span>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addMetadata}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        + Metadata
                                    </Button>
                                </div>
                                
                                <div className="space-y-3">
                                    {Object.entries(formData.config.metadata || {}).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-12 gap-4 items-end">
                                            <div className="col-span-5">
                                                <label className="block text-sm text-gray-400 mb-2">Key</label>
                                                <Input
                                                    type="text"
                                                    value={key}
                                                    onChange={(e) => updateMetadataKey(key, e.target.value)}
                                                    placeholder="user.id"
                                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                            <div className="col-span-5">
                                                <label className="block text-sm text-gray-400 mb-2">Value</label>
                                                <Input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => handleInputChange(`config.metadata.${key}`, e.target.value)}
                                                    placeholder="123"
                                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeMetadata(key)}
                                                    className="text-orange-500 hover:text-orange-400 p-2"
                                                    title="Remover metadata"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {Object.keys(formData.config.metadata || {}).length === 0 && (
                                        <div className="text-center text-gray-500 py-4">
                                            {`Nenhum metadata adicionado. Clique em "+ Metadata" para adicionar.`}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Webhook */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-white">Webhooks</h3>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addWebhook}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        + Webhook
                                    </Button>
                                </div>
                                
                                {formData.config.webhooks?.map((webhook, index) => (
                                    <div key={index} className="bg-gray-700 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-white">Webhook {index + 1}</h4>
                                            {formData.config.webhooks && formData.config.webhooks.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeWebhook(index)}
                                                    className="text-orange-500 hover:text-orange-400"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">URL</label>
                                                <Input
                                                    type="url"
                                                    value={webhook.url}
                                                    onChange={(e) => handleInputChange(`config.webhooks.${index}.url`, e.target.value)}
                                                    placeholder="https://webhook.site/11111111-1111-1111-1111-11111111"
                                                    className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Events</label>
                                                <Input
                                                    type="text"
                                                    value={webhook.events.join(', ')}
                                                    onChange={(e) => handleInputChange(`config.webhooks.${index}.events`, e.target.value.split(',').map(s => s.trim()))}
                                                    placeholder="message, session.status"
                                                    className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chats */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-white">Chats</h3>
                                        <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-white">i</span>
                                        </div>
                                    </div>
                                    <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Filter Chats
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                                            formData.config.ignore?.status ? 'bg-gray-700' : 'bg-gray-600'
                                        }`}
                                        onClick={() => handleInputChange('config.ignore.status', !formData.config.ignore?.status)}
                                    >
                                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                                        <span className="text-white font-medium">Status: {formData.config.ignore?.status ? 'On' : 'Off'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                                            formData.config.ignore?.groups ? 'bg-gray-700' : 'bg-gray-600'
                                        }`}
                                        onClick={() => handleInputChange('config.ignore.groups', !formData.config.ignore?.groups)}
                                    >
                                        <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                                        <span className="text-white font-medium">Groups: {formData.config.ignore?.groups ? 'On' : 'Off'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                                            formData.config.ignore?.channels ? 'bg-gray-700' : 'bg-gray-600'
                                        }`}
                                        onClick={() => handleInputChange('config.ignore.channels', !formData.config.ignore?.channels)}
                                    >
                                        <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                                        <span className="text-white font-medium">Channels: {formData.config.ignore?.channels ? 'On' : 'Off'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* System Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                            </svg>
                                        </div>
                                        <span className="text-white font-medium">Proxy</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                            formData.config.proxy ? 'bg-gray-700' : 'bg-gray-600'
                                        }`}
                                        onClick={() => handleInputChange('config.proxy', formData.config.proxy ? null : 'http://proxy:port')}
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                                        </svg>
                                        <span className="text-white">Proxy {formData.config.proxy ? 'On' : 'Off'}</span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-white font-medium">Debug</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                            formData.config.debug ? 'bg-gray-700' : 'bg-gray-600'
                                        }`}
                                        onClick={() => handleInputChange('config.debug', !formData.config.debug)}
                                    >
                                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-white">Debug {formData.config.debug ? 'Enabled' : 'Disabled'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !formData.name.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Criando...' : 'Criar Sessão'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSessionModal;