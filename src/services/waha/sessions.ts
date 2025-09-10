import { api } from "./api";

export interface CreateSessionData {
    name: string;
    start: boolean;
    config: {
        metadata?: Record<string, string>;
        proxy?: string | null;
        debug?: boolean;
        ignore?: {
            status?: string | null;
            groups?: string | null;
            channels?: string | null;
        };
        noweb?: {
            store?: {
                enabled?: boolean;
                fullSync?: boolean;
            };
        };
        webjs?: {
            tagsEventsOn?: boolean;
        };
        webhooks?: Array<{
            url: string;
            events: string[];
            hmac?: string | null;
            retries?: number | null;
            customHeaders?: Record<string, string> | null;
        }>;
    };
}

export interface SessionResponse {
    id: string;
    name: string;
    status: 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED';
    webhook?: string;
    config?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    me?: {
        id: string;
        pushName?: string;
    };
}

export interface SessionsListResponse {
    sessions: SessionResponse[];
    total: number;
}

// API para uso no servidor (API routes)
export const sessionsApi = {
    // Listar todas as sessões
    list: () => {
        return api.get<SessionsListResponse>('/sessions?all=true');
    },

    // Criar nova sessão
    create: (data: CreateSessionData) => {
        return api.post<SessionResponse, CreateSessionData>('/sessions', data);
    },

    // Obter sessão específica
    get: (sessionId: string) => {
        return api.get<SessionResponse>(`/sessions/${sessionId}`);
    },

    // Iniciar sessão
    start: (sessionId: string) => {
        return api.post<SessionResponse, Record<string, never>>(`/sessions/${sessionId}/start`, {});
    },

    // Parar sessão
    stop: (sessionId: string) => {
        return api.post<SessionResponse, Record<string, never>>(`/sessions/${sessionId}/stop`, {});
    },

    // Reiniciar sessão
    restart: (sessionId: string) => {
        return api.post<SessionResponse, Record<string, never>>(`/sessions/${sessionId}/restart`, {});
    },

    // Deletar sessão
    delete: (sessionId: string) => {
        return api.delete(`/sessions/${sessionId}`);
    },

    // Logout da sessão
    logout: (sessionName: string) => {
        return api.post<SessionResponse, Record<string, never>>(`/sessions/${sessionName}/logout`, {});
    }
};