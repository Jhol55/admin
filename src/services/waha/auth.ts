import { api } from "./api";

export interface AuthResponse {
    qrCode: string;
}

// API para autenticação (QR Code, etc.)
export const authApi = {
    // Obter QR Code
    getQRCode: (sessionName: string) => {
        return api.get<ArrayBuffer>(`/${sessionName}/auth/qr?format=image`);
    }
};
