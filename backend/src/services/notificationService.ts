import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { appState } from '../store.js';

type Contact = { userId: string; email?: string; phone?: string; subject: string; message: string };

export async function notifyContact(contact: Contact) {
  const channels: Array<{ channel: string; status: string; recipient?: string; error?: string }> = [];

  if (contact.email) {
    if (env.emailHost && env.emailUser && env.emailPassword) {
      try {
        const transporter = nodemailer.createTransport({ host: env.emailHost, port: env.emailPort, secure: env.emailPort === 465, auth: { user: env.emailUser, pass: env.emailPassword } });
        await transporter.sendMail({ from: env.emailUser, to: contact.email, subject: contact.subject, text: contact.message });
        channels.push({ channel: 'EMAIL', status: 'SENT', recipient: contact.email });
      } catch (error) { channels.push({ channel: 'EMAIL', status: 'FAILED', recipient: contact.email, error: error instanceof Error ? error.message : 'Email delivery failed' }); }
    } else channels.push({ channel: 'EMAIL', status: 'LOCAL_ONLY', recipient: contact.email });
  }

  if (contact.phone) {
    if (env.twilioAccountSid && env.twilioAuthToken && env.twilioFromNumber) {
      try {
        const body = new URLSearchParams({ To: contact.phone, From: env.twilioFromNumber, Body: contact.message });
        const auth = Buffer.from(`${env.twilioAccountSid}:${env.twilioAuthToken}`).toString('base64');
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.twilioAccountSid}/Messages.json`, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body });
        if (!response.ok) throw new Error(`Twilio returned ${response.status}`);
        channels.push({ channel: 'SMS', status: 'SENT', recipient: contact.phone });
      } catch (error) { channels.push({ channel: 'SMS', status: 'FAILED', recipient: contact.phone, error: error instanceof Error ? error.message : 'SMS delivery failed' }); }
    } else channels.push({ channel: 'SMS', status: 'LOCAL_ONLY', recipient: contact.phone });
  }

  appState.notifications.push({ id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, userId: contact.userId, type: 'REQUEST', title: contact.subject, message: contact.message, read: false, createdAt: new Date().toISOString(), channels });
  return channels;
}
