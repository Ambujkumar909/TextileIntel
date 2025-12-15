import emailjs from '@emailjs/browser';
import type { BriefingData } from '../types.ts';

export const sendBriefingEmail = async (data: BriefingData): Promise<boolean> => {
  // Credentials should be in .env and exposed via vite.config.ts
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  console.log("EmailJS ENV CHECK", {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
});

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS credentials missing. Please configure .env for auto-emailing.");
    return false;
  }

  // Format the message for the email template
  // Make sure your EmailJS template has variables: {{subject}}, {{date}}, {{message}}, {{sources}}
  const templateParams = {
    to_email: 'ambujkr8@gmail.com',
    to_name: 'Ambuj',
    subject: `Daily Briefing: ${new Date().toLocaleDateString()}`,
    date: new Date().toLocaleDateString(),
    message: data.summary,
    sources: data.sources.map(s => `${s.title}: ${s.uri}`).join('\n'),
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log("Email sent successfully via EmailJS");
    return true;
  } catch (error) {
    console.error("Failed to send email via EmailJS:", error);
    throw error;
  }
};