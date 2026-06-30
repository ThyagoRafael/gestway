/*
  Warnings:

  - Made the column `estoque_inicial_produto` on table `produto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estoque_minimo_produto` on table `produto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `produto` ADD COLUMN `estoque_atual_produto` INTEGER NULL,
    MODIFY `estoque_inicial_produto` INTEGER NOT NULL,
    MODIFY `estoque_minimo_produto` INTEGER NOT NULL;
