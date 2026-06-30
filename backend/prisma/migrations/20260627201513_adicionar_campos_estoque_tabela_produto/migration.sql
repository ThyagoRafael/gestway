/*
  Warnings:

  - You are about to drop the column `estoque_produto` on the `produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `produto` DROP COLUMN `estoque_produto`,
    ADD COLUMN `estoque_inicial_produto` INTEGER NULL,
    ADD COLUMN `estoque_minimo_produto` INTEGER NULL;
