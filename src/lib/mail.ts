import nodemailer from "nodemailer";

export async function sendResetEmail(email: string, resetUrl: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"), // porta 587 per STARTTLS, 465 per SSL
    secure: false,
    // false: STARTTLS (TLS su connessione inizialmente non sicura, come Google)
    // true: SSL (connessione sicura fin dall'inizio)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"SmartWaste Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
  });
}
