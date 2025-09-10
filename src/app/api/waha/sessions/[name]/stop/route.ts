import { NextRequest, NextResponse } from "next/server";
import { sessionsApi } from "../../../../../../services/waha/sessions";

// POST - Parar sessão
export async function POST(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const response = await sessionsApi.stop(params.name);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.error('Error stopping session:', error);
        const status = (error as { response?: { status?: number } })?.response?.status || 500;
        return NextResponse.json(
            { error: 'Failed to stop session' },
            { status }
        );
    }
}
