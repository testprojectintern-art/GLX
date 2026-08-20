import { NextResponse } from 'next/server';
import { sendSmsNotification } from '@/lib/smsGateway';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, message } = body;

    const res = await sendSmsNotification(phone, message);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message, status: 'Failed' },
      { status: 500 }
    );
  }
}
