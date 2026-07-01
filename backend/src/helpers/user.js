import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";

export async function getClienteId(usuarioId) {
	const cliente = await prisma.cliente.findFirst({
		where: {
			id_usuario: usuarioId,
		},
	});

	if (!cliente) {
		throw new AppError("Cliente não encontrado.", 404);
	}

	return cliente.id_cliente;
}
