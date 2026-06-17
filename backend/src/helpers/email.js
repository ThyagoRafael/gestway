import { transporter } from "../config/email.js";

export async function sendEmail(to, html) {
	return await transporter.sendMail(
		{
			from: process.env.EMAIL_USER,
			to,
			html,
		},
		(err, info) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log(info.envelope);
			console.log(info.response);
		},
	);
}
