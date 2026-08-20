import { NextResponse } from 'next/server';
import { saveLead } from '@/lib/contentStore';
import { sendSmsNotification } from '@/lib/smsGateway';
import { LeadItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, subject, message } = body;

    const adminRecipient = process.env.SMS_ALERT_RECIPIENT || '+94772268608';

    // 1. Format SMS Notification for GLX Admin
    const smsMessage = `[GLX NEW WEB INQUIRY]\nFrom: ${customerName} (${customerPhone})\nSubject: ${subject}\nMessage: ${message.slice(0, 80)}...`;

    // 2. Dispatch SMS via Gateway
    const smsRes = await sendSmsNotification(adminRecipient, smsMessage);

    // 3. Persist Lead in Database
    const newLead: LeadItem = {
      id: `LEAD-${Date.now()}`,
      type: 'contact',
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      subject,
      message,
      status: 'New',
      smsStatus: smsRes.status,
    };

    await saveLead(newLead);

    return NextResponse.json({
      success: true,
      lead: newLead,
      sms: smsRes,
    });
  } catch (error: any) {
    console.error('Error handling contact inquiry:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
