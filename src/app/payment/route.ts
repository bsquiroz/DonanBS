import { NextRequest } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const mercadoPagoClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!
});

const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
    const body = await req
        .json()
        .then((data) => data as { data: { id: string } });

    const payment = await new Payment(mercadoPagoClient).get({
        id: body.data.id
    });

    const donation = {
        id: payment.id,
        amount: payment.transaction_amount,
        message: payment.description
    };

    await supabaseClient.from('donations').insert(donation);

    return Response.json({ success: true });
}

export async function GET(req: NextRequest) {
    const donation = {
        id: 123,
        amount: 1000,
        message: 'TEST'
    };

    const result = await supabaseClient.from('donations').insert(donation);

    console.log(result);

    return Response.json({ success: true });
}
