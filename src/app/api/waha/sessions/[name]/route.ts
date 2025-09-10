import { NextRequest, NextResponse } from "next/server";
import { sessionsApi } from "../../../../../services/waha/sessions/sessions";

// GET - Obter sessão específica
export async function GET(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const response = await sessionsApi.get(params.name);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.error('Error fetching session:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status }
        );
    }
}

// DELETE - Deletar sessão
export async function DELETE(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const response = await sessionsApi.delete(params.name);
        return NextResponse.json({ success: true }, { status: response.status });
    } catch (error: unknown) {
        console.error('Error deleting session:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to delete session' },
            { status }
        );
    }
}