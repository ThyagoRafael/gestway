/*
  Warnings:

  - You are about to drop the column `cpf_cliente` on the `carrinho` table. All the data in the column will be lost.
  - The primary key for the `cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cpf_cliente` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `cpf_cliente` on the `venda` table. All the data in the column will be lost.
  - Added the required column `id_cliente` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cliente` to the `venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `carrinho` DROP FOREIGN KEY `fk_carrinho_cliente`;

-- DropForeignKey
ALTER TABLE `venda` DROP FOREIGN KEY `fk_venda_cliente`;

-- DropIndex
DROP INDEX `idx_carrinho_id_cliente` ON `carrinho`;

-- DropIndex
DROP INDEX `idx_venda_cliente` ON `venda`;

-- AlterTable
ALTER TABLE `carrinho` DROP COLUMN `cpf_cliente`,
    ADD COLUMN `id_cliente` INTEGER NULL;

-- AlterTable
ALTER TABLE `cliente` DROP PRIMARY KEY,
    DROP COLUMN `cpf_cliente`,
    ADD COLUMN `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_cliente`);

-- AlterTable
ALTER TABLE `venda` DROP COLUMN `cpf_cliente`,
    ADD COLUMN `id_cliente` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `idx_carrinho_id_cliente` ON `carrinho`(`id_cliente`);

-- CreateIndex
CREATE INDEX `idx_venda_cliente` ON `venda`(`id_cliente`);

-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `fk_carrinho_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `venda` ADD CONSTRAINT `fk_venda_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE RESTRICT ON UPDATE RESTRICT;
