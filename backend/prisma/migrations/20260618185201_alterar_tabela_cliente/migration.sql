/*
  Warnings:

  - You are about to drop the column `email_cliente` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nome_cliente` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_cliente` on the `cliente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_usuario]` on the table `cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_usuario` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Made the column `data_criacao_vendedor` on table `vendedor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data_atualizacao_vendedor` on table `vendedor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `criado_em` on table `voucher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atualizado_em` on table `voucher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `uq_cliente_email` ON `cliente`;

-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `email_cliente`,
    DROP COLUMN `nome_cliente`,
    DROP COLUMN `telefone_cliente`,
    ADD COLUMN `id_usuario` INTEGER NOT NULL,
    ALTER COLUMN `atualizado_em` DROP DEFAULT;

-- AlterTable
ALTER TABLE `comissao_mensal_vendedor` ALTER COLUMN `atualizado_em` DROP DEFAULT;

-- AlterTable
ALTER TABLE `vendedor` MODIFY `data_criacao_vendedor` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `data_atualizacao_vendedor` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `voucher` MODIFY `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `atualizado_em` DATETIME(0) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cliente_id_usuario_key` ON `cliente`(`id_usuario`);

-- AddForeignKey
ALTER TABLE `cliente` ADD CONSTRAINT `cliente_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
