-- AlterTable
ALTER TABLE `produto` ADD COLUMN `id_vendedor` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_id_vendedor_fkey` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor`(`id_vendedor`) ON DELETE SET NULL ON UPDATE CASCADE;
