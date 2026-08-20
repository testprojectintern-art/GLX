export interface SmsResponse {
  success: boolean;
  message: string;
  campaignId?: string;
  status: 'Sent' | 'Failed' | 'Simulated';
}

export function formatSriLankanPhone(phone: string): string {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '94' + clean.slice(1);
  }
  if (clean.length === 9) {
    clean = '94' + clean;
  }
  if (!clean.startsWith('+')) {
    return '+' + clean;
  }
  return clean;
}

export async function sendSmsNotification(
  recipientPhone: string,
  messageText: string
): Promise<SmsResponse> {
  const userId = process.env.SMS_USER_ID;
  const apiKey = process.env.SMS_API_KEY;
  const rawSenderId = process.env.SMS_SENDER_ID || 'GLXINDUST';
  const gatewayUrl = process.env.SMS_GATEWAY_URL || 'https://smslenz.lk/api/send-sms';

  // Limit Sender ID strictly to 11 characters
  const senderId = rawSenderId.slice(0, 11);
  const formattedContact = formatSriLankanPhone(recipientPhone);

  if (!formattedContact || formattedContact.length < 10) {
    return {
      success: false,
      message: 'Invalid recipient phone number format.',
      status: 'Failed'
    };
  }

  // If live credentials are not set or are mock, log simulated dispatch
  if (!apiKey || apiKey === 'your_sms_gateway_api_key_here' || apiKey === 'mock_dev_key') {
    console.log(`[GLX SMS GATEWAY - SIMULATED DISPATCH]`);
    console.log(`Sender ID : ${senderId}`);
    console.log(`To        : ${formattedContact}`);
    console.log(`Message   :\n${messageText}`);
    return {
      success: true,
      message: `[Simulated] SMS successfully queued for ${formattedContact}`,
      campaignId: `SIM-${Date.now()}`,
      status: 'Simulated'
    };
  }

  try {
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        api_key: apiKey,
        sender_id: senderId,
        contact: formattedContact,
        message: messageText
      })
    });

    const data = await response.json();
    if (response.ok && (data.success || data.status === 'success' || data.status === 200)) {
      return {
        success: true,
        message: 'SMS sent successfully through GLX Gateway.',
        campaignId: data.data?.campaign_id || data.campaign_id,
        status: 'Sent'
      };
    } else {
      console.error('[SMS Gateway Error]', data);
      return {
        success: false,
        message: data.message || 'SMS Gateway returned an error response.',
        status: 'Failed'
      };
    }
  } catch (error: any) {
    console.error('[SMS Gateway Exception]', error.message);
    return {
      success: false,
      message: error.message || 'Network exception while connecting to SMS gateway.',
      status: 'Failed'
    };
  }
}
