/*
  Warnings:

  - You are about to drop the column `usuario_tipo` on the `token_recuperacao_senha` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `idx_token_usuario` ON `token_recuperacao_senha`;

-- AlterTable
ALTER TABLE `token_recuperacao_senha` DROP COLUMN `usuario_tipo`,
    MODIFY `data_criacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
