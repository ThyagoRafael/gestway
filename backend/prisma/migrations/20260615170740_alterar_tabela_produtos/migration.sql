/*
  Warnings:

  - You are about to drop the column `estoque_atual_produto` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `estoque_inicial_produto` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `estoque_minimo_produto` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `preco_venda_produto` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `sku_produto` on the `produto` table. All the data in the column will be lost.
  - Added the required column `estoque_produto` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco_produto` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Made the column `data_criacao_produto` on table `produto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data_atualizacao_produto` on table `produto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `idx_produto_estoque` ON `produto`;

-- DropIndex
DROP INDEX `uq_produto_sku` ON `produto`;

-- AlterTable
ALTER TABLE `produto` DROP COLUMN `estoque_atual_produto`,
    DROP COLUMN `estoque_inicial_produto`,
    DROP COLUMN `estoque_minimo_produto`,
    DROP COLUMN `preco_venda_produto`,
    DROP COLUMN `sku_produto`,
    ADD COLUMN `estoque_produto` INTEGER NOT NULL,
    ADD COLUMN `preco_produto` DECIMAL(10, 2) NOT NULL,
    MODIFY `data_criacao_produto` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `data_atualizacao_produto` DATETIME(0) NOT NULL;
