import { NextRequest, NextResponse } from "next/server";
import { sessionsApi } from "../../../../../../services/waha/sessions/sessions";

// POST - Reiniciar sessão
export async function POST(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const response = await sessionsApi.restart(params.name);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.error('Error restarting session:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to restart session' },
            { status }
        );
    }
}
