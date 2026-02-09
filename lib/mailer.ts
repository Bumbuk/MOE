import nodemailer from "nodemailer";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`ENV ${name} is not set`);
  return v;
}

export async function sendLeadEmail(payload: {
  subject: string;
  text: string;
}) {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT"));
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  const from = env("SMTP_FROM");
  const to = env("LEADS_TO");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: payload.subject,
    text: payload.text,
  });
}
