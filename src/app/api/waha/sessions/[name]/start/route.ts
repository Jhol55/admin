import { NextRequest, NextResponse } from "next/server";
import { sessionsApi } from "../../../../../../services/waha/sessions";

// POST - Iniciar sessão
export async function POST(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const response = await sessionsApi.start(params.name);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.error('Error starting session:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to start session' },
            { status }
        );
    }
}
