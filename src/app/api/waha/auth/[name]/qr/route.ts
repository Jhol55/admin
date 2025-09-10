import { NextRequest, NextResponse } from "next/server";
import { authApi } from "../../../../../../services/waha/auth/auth";

// GET - Obter QR Code da sessão
export async function GET(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const response = await authApi.getQRCode(params.name);
        
        if (response.data) {
            return new NextResponse(response.data, { 
                status: response.status, 
                headers: { 
                    'Content-Type': 'image/png', 
                    'Cache-Control': 'no-cache' 
                } 
            });
        }
        
        return NextResponse.json(
            { error: 'QR Code not available' },
            { status: 404 }
        );
    } catch (error: unknown) {
        console.error('Error getting QR code:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to get QR code' },
            { status }
        );
    }
}
