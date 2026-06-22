/*
  Warnings:

  - The primary key for the `movimentacao_estoque` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_movimentacao` on the `movimentacao_estoque` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `movimentacao_estoque` DROP PRIMARY KEY,
    MODIFY `id_movimentacao` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_movimentacao`);
