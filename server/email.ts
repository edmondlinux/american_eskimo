import nodemailer from "nodemailer";

export async function sendInquiryEmail({
  to,
  subject,
  content,
  isHtml = true,
}: {
  to: string;
  subject: string;
  content: string;
  isHtml?: boolean;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"American Eskimo Breeder" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    [isHtml ? "html" : "text"]: content,
  };

  return transporter.sendMail(mailOptions);
}

export function generateAdminEmailHtml(inquiry: any, puppyName: string | null) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #c08c5d;">New Inquiry Received</h2>
      <p><strong>From:</strong> ${inquiry.fullName}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone}</p>
      <p><strong>Address:</strong> ${inquiry.address}</p>
      <p><strong>Selected Puppy:</strong> ${puppyName || "None selected"}</p>
      <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${inquiry.message}</p>
      </div>
    </div>
  `;
}

export function generateUserEmailHtml(inquiry: any, puppyName: string | null) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #c08c5d;">Inquiry Received — American Eskimo</h2>
      <p>Hi ${inquiry.fullName},</p>
      <p>Thank you for reaching out to us about ${puppyName ? `our puppy ${puppyName}` : "a puppy placement"}. We have received your inquiry and will review it thoughtfully.</p>
      <p>We typically respond within 1–2 business days to discuss next steps and compatibility.</p>
      <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
        <p><strong>Your Message Summary:</strong></p>
        <p style="white-space: pre-wrap;">${inquiry.message}</p>
      </div>
      <p style="margin-top: 20px; color: #888; font-size: 12px;">This is an automated confirmation. We'll be in touch soon!</p>
    </div>
  `;
}
