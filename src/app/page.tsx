import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { redirect } from 'next/navigation';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!
});

export default function Home() {
    async function donate(formData: FormData) {
        'use server';

        const preference = await new Preference(client).create({
            body: {
                items: [
                    {
                        id: 'Donacion',
                        title: formData.get('message') as string,
                        quantity: 1,
                        unit_price: Number(formData.get('amount'))
                    }
                ]
            }
        });

        redirect(preference.sandbox_init_point!);
    }

    return (
        <>
            <h2 className='text-primary font-bold uppercase text-2xl text-center'>
                Donaciones
            </h2>
            <form
                className='grid gap-5 border p-5 rounded-md border-border'
                action={donate}
            >
                <div className='grid gap-2'>
                    <Label htmlFor='amount'>Cantidad donada</Label>
                    <Input
                        type='number'
                        placeholder='ej: 30.000'
                        name='amount'
                        id='amount'
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='message'>Deja un mensaje</Label>
                    <Textarea
                        placeholder='Gracias por ser el mejor'
                        name='message'
                        id='message'
                    ></Textarea>
                </div>
                <Button>Enviar donación</Button>
            </form>
        </>
    );
}
