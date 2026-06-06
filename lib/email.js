import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_DESTINO = process.env.EMAIL_DESTINO;

export async function enviarEmail({ assunto, html }) {
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS || !EMAIL_DESTINO) {
        throw new Error("Configurações de email incompletas");
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Controle de Gastos" <${EMAIL_USER}`,
        to: EMAIL_DESTINO,
        subject: assunto,
        html
    })
}