import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger
} from '@/components/ui/drawer';

import { ScrollArea } from '@/components/ui/scroll-area';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!
});

const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLIC_KEY!
);

export default async function Home() {
    const donations = await supabaseClient
        .from('donations')
        .select('*')
        .then(
            ({ data }) =>
                data as unknown as Promise<
                    {
                        id: number;
                        created_at: number;
                        amount: number;
                        message: string;
                    }[]
                >
        );

    console.log(donations);

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
            <h2 className='text-primary font-bold uppercase text-2xl text-center mb-10'>
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
                        placeholder='Ej: 30.000'
                        name='amount'
                        id='amount'
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='message'>Deja un mensaje</Label>
                    <Textarea
                        placeholder='Ej: Gracias por ser el mejor'
                        name='message'
                        id='message'
                    ></Textarea>
                </div>
                <Button>Enviar donación</Button>
            </form>

            <Drawer>
                <DrawerTrigger className='p-5'>
                    <Button>Ver donaciones</Button>
                </DrawerTrigger>
                <DrawerContent className='p-5'>
                    <ScrollArea className='h-72'>
                        <Table className='max-w-lg m-auto'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mensaje</TableHead>
                                    <TableHead>Valor donacion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {donations.map((donation) => (
                                    <TableRow key={donation.id}>
                                        <TableCell className='font-medium'>
                                            {donation?.message}
                                        </TableCell>
                                        <TableCell>
                                            ${donation?.amount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>

                    <DrawerFooter>
                        <DrawerClose>
                            <Button>Cerrar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
