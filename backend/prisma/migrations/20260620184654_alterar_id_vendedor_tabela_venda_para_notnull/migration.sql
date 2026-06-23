/*
  Warnings:

  - Made the column `id_vendedor` on table `venda` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `venda` DROP FOREIGN KEY `fk_venda_vendedor`;

-- AlterTable
ALTER TABLE `venda` MODIFY `id_vendedor` INTEGER NOT NULL,
    ALTER COLUMN `atualizado_em` DROP DEFAULT;

-- AlterTable
ALTER TABLE `venda_item` ALTER COLUMN `atualizado_em` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `venda` ADD CONSTRAINT `fk_venda_vendedor` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor`(`id_vendedor`) ON DELETE RESTRICT ON UPDATE RESTRICT;
