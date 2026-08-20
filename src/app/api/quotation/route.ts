import { NextResponse } from 'next/server';
import { saveLead } from '@/lib/contentStore';
import { sendSmsNotification } from '@/lib/smsGateway';
import { LeadItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerCity,
      vehicleCategory,
      vehicleName,
      selectedOptions,
      estimatedPrice,
      quotationRef,
      customerNotes,
    } = body;

    const adminRecipient = process.env.SMS_ALERT_RECIPIENT || '+94772268608';

    // 1. Format SMS Notification for GLX Admin
    const optionsText = selectedOptions && selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Standard Build';
    const formattedPrice = estimatedPrice ? `Rs. ${estimatedPrice.toLocaleString('en-LK')}` : 'N/A';

    const smsMessage = `[GLX NEW QUOTATION LEAD]\nRef: ${quotationRef}\nCustomer: ${customerName} (${customerPhone})\nVehicle: ${vehicleName}\nTotal: ${formattedPrice}\nOptions: ${optionsText}\nCity: ${customerCity || 'N/A'}`;

    // 2. Dispatch SMS via Gateway
    const smsRes = await sendSmsNotification(adminRecipient, smsMessage);

    // 3. Persist Lead in Database
    const newLead: LeadItem = {
      id: `LEAD-${Date.now()}`,
      type: 'quotation',
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      vehicleCategory,
      vehicleName,
      selectedOptions,
      estimatedPrice,
      quotationRef,
      customerNotes,
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
    console.error('Error handling quotation request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
