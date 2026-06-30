/*
  Warnings:

  - Made the column `cpf_vendedor` on table `vendedor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `vendedor` MODIFY `cpf_vendedor` VARCHAR(14) NOT NULL;
