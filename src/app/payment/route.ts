import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const body: unknown = await req.json();
    console.log({ body });

    return Response.json({ success: true });
}
