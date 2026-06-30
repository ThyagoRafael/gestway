/*
  Warnings:

  - A unique constraint covering the columns `[cpf_vendedor]` on the table `vendedor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `vendedor` ADD COLUMN `cpf_vendedor` VARCHAR(14) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cpf_vendedor_UNIQUE` ON `vendedor`(`cpf_vendedor`);
