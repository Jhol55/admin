import { NextRequest, NextResponse } from "next/server";
import { profileApi } from "../../../../../services/waha/profile";

// GET - Obter perfil da sessão
export async function GET(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const response = await profileApi.getProfile(params.name);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.error('Error getting profile:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to get profile' },
            { status }
        );
    }
}
