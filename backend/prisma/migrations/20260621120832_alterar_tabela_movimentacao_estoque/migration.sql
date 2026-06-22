/*
  Warnings:

  - You are about to drop the column `responsavel_id` on the `movimentacao_estoque` table. All the data in the column will be lost.
  - You are about to drop the column `responsavel_tipo` on the `movimentacao_estoque` table. All the data in the column will be lost.
  - Made the column `id_vendedor` on table `movimentacao_estoque` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `movimentacao_estoque` DROP FOREIGN KEY `fk_mov_vendedor`;

-- AlterTable
ALTER TABLE `movimentacao_estoque` DROP COLUMN `responsavel_id`,
    DROP COLUMN `responsavel_tipo`,
    MODIFY `id_vendedor` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `movimentacao_estoque` ADD CONSTRAINT `fk_mov_vendedor` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor`(`id_vendedor`) ON DELETE RESTRICT ON UPDATE RESTRICT;
