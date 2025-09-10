import { NextRequest, NextResponse } from "next/server";
import { sessionsApi, CreateSessionData } from "../../../../services/waha/sessions";

// GET - Listar sessões
export async function GET() {
    try {
        const response = await sessionsApi.list();
        console.log('Sessions fetched successfully:', response.data);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.error('Error fetching sessions:', error);        
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to fetch sessions' },
            { status }
        );
    }
}

// POST - Criar nova sessão
export async function POST(request: NextRequest) {
    try {
        const data: CreateSessionData = await request.json();
        
        // Validação básica
        if (!data.name || typeof data.name !== 'string') {
            return NextResponse.json(
                { error: 'Session name is required' },
                { status: 400 }
            );
        }

        const response = await sessionsApi.create(data);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.error('Error creating session:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status }
        );
    }
}