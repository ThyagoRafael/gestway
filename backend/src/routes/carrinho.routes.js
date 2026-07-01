import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import carrinhoController from "../controllers/carrinho.controller.js";

export const carrinhoRoutes = Router();

// Todas as rotas exigem token — o usuário precisa estar logado como cliente
carrinhoRoutes.use(authMiddleware);

// GET  /api/carrinho        — retorna o carrinho aberto do cliente logado
carrinhoRoutes.get("/", carrinhoController.get);

// POST /api/carrinho/itens  — adiciona ou incrementa item
carrinhoRoutes.post("/itens", carrinhoController.addItem);

// PATCH /api/carrinho/itens/:idProduto — altera quantidade de um item
carrinhoRoutes.patch("/itens/:idProduto", carrinhoController.updateItem);

// DELETE /api/carrinho/itens/:idProduto — remove um item
carrinhoRoutes.delete("/itens/:idProduto", carrinhoController.removeItem);

// DELETE /api/carrinho — limpa o carrinho inteiro (status → CANCELADO)
carrinhoRoutes.delete("/", carrinhoController.clear);
