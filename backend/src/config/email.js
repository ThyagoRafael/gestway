import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

export async function verifySMTPConnection() {
	try {
		await transporter.verify();
		console.log("SMTP configurado");
	} catch (error) {
		console.error("Erro na configuração SMTP:", error);
	}
}
