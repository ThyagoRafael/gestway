/*
  Warnings:

  - Made the column `data_criacao_categoria` on table `categoria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data_atualizacao_categoria` on table `categoria` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `categoria` MODIFY `data_criacao_categoria` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `data_atualizacao_categoria` DATETIME(0) NOT NULL;
