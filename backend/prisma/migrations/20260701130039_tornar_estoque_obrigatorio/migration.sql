/*
  Warnings:

  - Made the column `estoque_atual_produto` on table `produto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `produto` MODIFY `estoque_atual_produto` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `venda` MODIFY `status_pagamento` ENUM('AGUARDANDO', 'APROVADO', 'RECUSADO', 'CANCELADO', 'ESTORNADO') NOT NULL DEFAULT 'APROVADO';
