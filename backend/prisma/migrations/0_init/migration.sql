-- CreateTable
CREATE TABLE `aceite_termos` (
    `id_aceite` BIGINT NOT NULL AUTO_INCREMENT,
    `usuario_tipo` ENUM('ADMINISTRADOR', 'VENDEDOR', 'COMPRADOR') NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `documento_tipo` ENUM('TERMOS_USO', 'POLITICA_PRIVACIDADE') NOT NULL,
    `versao_documento` VARCHAR(20) NOT NULL,
    `data_hora_aceite` DATETIME(0) NOT NULL,

    INDEX `idx_aceite_data`(`data_hora_aceite`),
    INDEX `idx_aceite_usuario`(`usuario_tipo`, `usuario_id`),
    PRIMARY KEY (`id_aceite`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_completo_usuario` VARCHAR(150) NOT NULL,
    `email_usuario` VARCHAR(150) NOT NULL,
    `telefone_usuario` VARCHAR(11) NOT NULL,
    `senha_hash_usuario` VARCHAR(255) NOT NULL,
    `foto_url_usuario` VARCHAR(255) NULL,

    UNIQUE INDEX `email_usuario_UNIQUE`(`email_usuario`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrador` (
    `id_administrador` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `data_criacao_administrador` DATETIME(0) NULL,
    `data_atualizacao_administrador` DATETIME(0) NULL,

    UNIQUE INDEX `id_administrador_UNIQUE`(`id_administrador`),
    UNIQUE INDEX `administrador_id_usuario_key`(`id_usuario`),
    INDEX `idx_administrador_datas`(`data_criacao_administrador`, `data_atualizacao_administrador`),
    PRIMARY KEY (`id_administrador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id_audit` BIGINT NOT NULL AUTO_INCREMENT,
    `tabela` VARCHAR(64) NOT NULL,
    `registro_pk` VARCHAR(64) NOT NULL,
    `acao` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    `usuario_tipo` ENUM('ADMINISTRADOR', 'VENDEDOR', 'COMPRADOR', 'SISTEMA') NOT NULL DEFAULT 'SISTEMA',
    `usuario_id` INTEGER NULL,
    `origem` VARCHAR(80) NULL,
    `ocorrido_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dados_antes` JSON NULL,
    `dados_depois` JSON NULL,

    INDEX `idx_audit_ocorrido`(`ocorrido_em`),
    INDEX `idx_audit_tabela_pk`(`tabela`, `registro_pk`),
    INDEX `idx_audit_usuario`(`usuario_tipo`, `usuario_id`),
    PRIMARY KEY (`id_audit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banner` (
    `id_banner` INTEGER NOT NULL,
    `titulo_banner` VARCHAR(64) NULL,
    `texto_descricao_upper_banner` VARCHAR(64) NULL,
    `texto_descricao_banner` VARCHAR(64) NULL,
    `texto_desconto` VARCHAR(21) NULL,
    `imagem_url_banner` VARCHAR(255) NULL,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `criado_por_id_administrador` INTEGER NULL,
    `atualizado_por_id_administrador` INTEGER NULL,

    INDEX `fk_banner_atualizado_por_admin`(`atualizado_por_id_administrador`),
    INDEX `fk_banner_criado_por_admin`(`criado_por_id_administrador`),
    PRIMARY KEY (`id_banner`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrinho` (
    `id_carrinho` BIGINT NOT NULL AUTO_INCREMENT,
    `comprador_tipo` ENUM('COMPRADOR') NOT NULL DEFAULT 'COMPRADOR',
    `comprador_id` INTEGER NOT NULL,
    `cpf_cliente` CHAR(11) NULL,
    `status_carrinho` ENUM('ABERTO', 'CONVERTIDO_EM_PEDIDO', 'CANCELADO') NOT NULL DEFAULT 'ABERTO',
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_carrinho_comprador`(`comprador_tipo`, `comprador_id`),
    INDEX `idx_carrinho_comprador_status`(`comprador_tipo`, `comprador_id`, `status_carrinho`),
    INDEX `idx_carrinho_datas`(`criado_em`, `atualizado_em`),
    INDEX `idx_carrinho_id_cliente`(`cpf_cliente`),
    INDEX `idx_carrinho_status`(`status_carrinho`),
    PRIMARY KEY (`id_carrinho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrinho_item` (
    `id_carrinho_item` BIGINT NOT NULL AUTO_INCREMENT,
    `id_carrinho` BIGINT NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `preco_unitario_snapshot` DECIMAL(10, 2) NULL,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_carrinho_item_carrinho`(`id_carrinho`),
    INDEX `idx_carrinho_item_produto`(`id_produto`),
    UNIQUE INDEX `uq_carrinho_item_produto`(`id_carrinho`, `id_produto`),
    PRIMARY KEY (`id_carrinho_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_categoria` VARCHAR(150) NOT NULL,
    `imagem_categoria` VARCHAR(255) NULL,
    `descricao_categoria` VARCHAR(250) NULL,
    `tipo_categoria` ENUM('PRODUTO', 'SERVICO') NOT NULL DEFAULT 'PRODUTO',
    `status_categoria` ENUM('DISPONIVEL', 'INATIVO') NOT NULL DEFAULT 'DISPONIVEL',
    `data_criacao_categoria` DATETIME(0) NULL,
    `data_atualizacao_categoria` DATETIME(0) NULL,

    UNIQUE INDEX `idcategoria_UNIQUE`(`id_categoria`),
    INDEX `idx_categoria_status_tipo`(`status_categoria`, `tipo_categoria`),
    UNIQUE INDEX `uq_categoria_nome_tipo`(`nome_categoria`, `tipo_categoria`),
    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente` (
    `cpf_cliente` CHAR(11) NOT NULL,
    `nome_cliente` VARCHAR(150) NOT NULL,
    `email_cliente` VARCHAR(150) NOT NULL,
    `telefone_cliente` VARCHAR(11) NOT NULL,
    `status_cliente` ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_cliente_email`(`email_cliente`),
    INDEX `idx_cliente_datas`(`criado_em`, `atualizado_em`),
    INDEX `idx_cliente_status`(`status_cliente`),
    PRIMARY KEY (`cpf_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comissao_mensal_vendedor` (
    `id_comissao_mensal` BIGINT NOT NULL AUTO_INCREMENT,
    `id_vendedor` INTEGER NOT NULL,
    `competencia` DATE NOT NULL,
    `valor_comissao` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `id_status_comissao_mensal` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `observacao` VARCHAR(255) NULL,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_comissao_mensal_competencia`(`competencia`),
    INDEX `idx_comissao_mensal_status`(`id_status_comissao_mensal`),
    INDEX `idx_comissao_mensal_vendedor`(`id_vendedor`),
    UNIQUE INDEX `uq_comissao_mensal_vendedor_competencia`(`id_vendedor`, `competencia`),
    PRIMARY KEY (`id_comissao_mensal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cores_marca` (
    `id_cores_marca` INTEGER NOT NULL AUTO_INCREMENT,
    `id_edicao_site` INTEGER NOT NULL,
    `cor_primaria` CHAR(7) NULL,
    `cor_secundaria` CHAR(7) NULL,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `criado_por_id_administrador` INTEGER NULL,
    `atualizado_por_id_administrador` INTEGER NULL,

    UNIQUE INDEX `uq_cores_marca_edicao_site`(`id_edicao_site`),
    INDEX `fk_cores_marca_atualizado_por_admin`(`atualizado_por_id_administrador`),
    INDEX `fk_cores_marca_criado_por_admin`(`criado_por_id_administrador`),
    PRIMARY KEY (`id_cores_marca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `edicao_site` (
    `id_edicao_site` INTEGER NOT NULL AUTO_INCREMENT,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `criado_por_id_administrador` INTEGER NULL,
    `atualizado_por_id_administrador` INTEGER NULL,

    UNIQUE INDEX `id_edicao_site_UNIQUE`(`id_edicao_site`),
    INDEX `fk_edicao_site_atualizado_por_admin`(`atualizado_por_id_administrador`),
    INDEX `fk_edicao_site_criado_por_admin`(`criado_por_id_administrador`),
    PRIMARY KEY (`id_edicao_site`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `geracao_relatorio` (
    `id_geracao` BIGINT NOT NULL AUTO_INCREMENT,
    `tipo_relatorio` ENUM('VENDAS_MENSAIS_PDF', 'INVENTARIO_ESTOQUE_EXCEL', 'DESEMPENHO_VENDEDORES_PDF', 'MOVIMENTACOES_ESTOQUE_EXCEL') NOT NULL,
    `data_inicio` DATE NOT NULL,
    `data_fim` DATE NOT NULL,
    `gerado_em` DATETIME(0) NOT NULL,
    `id_administrador` INTEGER NOT NULL,

    INDEX `fk_geracao_relatorio_admin`(`id_administrador`),
    INDEX `idx_relatorio_gerado_em`(`gerado_em`),
    INDEX `idx_relatorio_periodo`(`data_inicio`, `data_fim`),
    INDEX `idx_relatorio_tipo`(`tipo_relatorio`),
    PRIMARY KEY (`id_geracao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grid` (
    `id_grid` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo_grid` VARCHAR(45) NOT NULL,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `criado_por_id_administrador` INTEGER NULL,
    `atualizado_por_id_administrador` INTEGER NULL,

    UNIQUE INDEX `idgrid_UNIQUE`(`id_grid`),
    UNIQUE INDEX `titulo_grid_UNIQUE`(`titulo_grid`),
    INDEX `fk_grid_atualizado_por_admin`(`atualizado_por_id_administrador`),
    INDEX `fk_grid_criado_por_admin`(`criado_por_id_administrador`),
    PRIMARY KEY (`id_grid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logotipo` (
    `id_logotipo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_edicao_site` INTEGER NOT NULL,
    `logotipo_url` VARCHAR(255) NOT NULL,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `criado_por_id_administrador` INTEGER NULL,
    `atualizado_por_id_administrador` INTEGER NULL,

    UNIQUE INDEX `uq_logotipo_edicao_site`(`id_edicao_site`),
    INDEX `fk_logotipo_atualizado_por_admin`(`atualizado_por_id_administrador`),
    INDEX `fk_logotipo_criado_por_admin`(`criado_por_id_administrador`),
    PRIMARY KEY (`id_logotipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimentacao_estoque` (
    `id_movimentacao` BIGINT NOT NULL AUTO_INCREMENT,
    `id_produto` INTEGER NOT NULL,
    `tipo_movimentacao` ENUM('ENTRADA', 'SAIDA', 'AJUSTE') NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `motivo` VARCHAR(255) NOT NULL,
    `responsavel_tipo` ENUM('ADMINISTRADOR', 'VENDEDOR') NOT NULL,
    `responsavel_id` INTEGER NOT NULL,
    `data_hora` DATETIME(0) NOT NULL,
    `id_vendedor` INTEGER NULL,

    INDEX `idx_mov_data`(`data_hora`),
    INDEX `idx_mov_id_vendedor`(`id_vendedor`),
    INDEX `idx_mov_produto`(`id_produto`),
    INDEX `idx_mov_tipo`(`tipo_movimentacao`),
    PRIMARY KEY (`id_movimentacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto` (
    `id_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_produto` VARCHAR(150) NOT NULL,
    `preco_venda_produto` DECIMAL(10, 2) NOT NULL,
    `estoque_inicial_produto` INTEGER NOT NULL,
    `estoque_minimo_produto` INTEGER NOT NULL,
    `imagem_produto` VARCHAR(255) NULL,
    `descricao_produto` VARCHAR(250) NULL,
    `id_categoria` INTEGER NULL,
    `sku_produto` VARCHAR(64) NULL,
    `status_produto` ENUM('BAIXO_ESTOQUE', 'INDISPONIVEL', 'DISPONIVEL', 'INATIVO') NOT NULL DEFAULT 'DISPONIVEL',
    `ativo_produto` BOOLEAN NOT NULL DEFAULT true,
    `controla_estoque_produto` BOOLEAN NOT NULL DEFAULT true,
    `estoque_atual_produto` INTEGER NULL,
    `data_criacao_produto` DATETIME(0) NULL,
    `data_atualizacao_produto` DATETIME(0) NULL,

    UNIQUE INDEX `idproduto_UNIQUE`(`id_produto`),
    UNIQUE INDEX `uq_produto_sku`(`sku_produto`),
    INDEX `idx_produto_ativo`(`ativo_produto`),
    INDEX `idx_produto_categoria`(`id_categoria`),
    INDEX `idx_produto_estoque`(`estoque_atual_produto`, `estoque_minimo_produto`),
    INDEX `idx_produto_status`(`status_produto`),
    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ref_status_comissao_mensal` (
    `id_status_comissao_mensal` TINYINT UNSIGNED NOT NULL,
    `codigo_status_comissao_mensal` VARCHAR(32) NOT NULL,
    `descricao_status_comissao_mensal` VARCHAR(120) NOT NULL,
    `ordem_exibicao` TINYINT UNSIGNED NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_ref_status_comissao_mensal_codigo`(`codigo_status_comissao_mensal`),
    INDEX `idx_ref_status_comissao_mensal_ativo`(`ativo`),
    INDEX `idx_ref_status_comissao_mensal_ordem`(`ordem_exibicao`),
    PRIMARY KEY (`id_status_comissao_mensal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorio_desempenho_vendedores` (
    `id_relatorio_desempenho_vendedores` BIGINT NOT NULL AUTO_INCREMENT,
    `data_inicio` DATE NOT NULL,
    `data_fim` DATE NOT NULL,
    `formato_arquivo` ENUM('EXCEL') NOT NULL DEFAULT 'EXCEL',
    `incluir_ranking_vendas` BOOLEAN NOT NULL DEFAULT true,
    `incluir_ranking_comissoes` BOOLEAN NOT NULL DEFAULT true,
    `id_administrador` INTEGER NOT NULL,
    `gerado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rel_desempenho_vendedores_admin`(`id_administrador`),
    INDEX `idx_rel_desempenho_vendedores_gerado_em`(`gerado_em`),
    INDEX `idx_rel_desempenho_vendedores_periodo`(`data_inicio`, `data_fim`),
    PRIMARY KEY (`id_relatorio_desempenho_vendedores`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorio_inventario_estoque` (
    `id_relatorio_inventario_estoque` BIGINT NOT NULL AUTO_INCREMENT,
    `data_inicio` DATE NOT NULL,
    `data_fim` DATE NOT NULL,
    `formato_arquivo` ENUM('EXCEL') NOT NULL DEFAULT 'EXCEL',
    `incluir_lista_produtos` BOOLEAN NOT NULL DEFAULT true,
    `incluir_quantidade` BOOLEAN NOT NULL DEFAULT true,
    `incluir_valor_total_estoque` BOOLEAN NOT NULL DEFAULT true,
    `id_administrador` INTEGER NOT NULL,
    `gerado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rel_inventario_estoque_admin`(`id_administrador`),
    INDEX `idx_rel_inventario_estoque_gerado_em`(`gerado_em`),
    INDEX `idx_rel_inventario_estoque_periodo`(`data_inicio`, `data_fim`),
    PRIMARY KEY (`id_relatorio_inventario_estoque`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorio_movimentacoes_estoque` (
    `id_relatorio_movimentacoes_estoque` BIGINT NOT NULL AUTO_INCREMENT,
    `data_inicio` DATE NOT NULL,
    `data_fim` DATE NOT NULL,
    `formato_arquivo` ENUM('EXCEL') NOT NULL DEFAULT 'EXCEL',
    `incluir_entradas` BOOLEAN NOT NULL DEFAULT true,
    `incluir_saidas` BOOLEAN NOT NULL DEFAULT true,
    `incluir_ajustes` BOOLEAN NOT NULL DEFAULT true,
    `id_administrador` INTEGER NOT NULL,
    `gerado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rel_movimentacoes_estoque_admin`(`id_administrador`),
    INDEX `idx_rel_movimentacoes_estoque_gerado_em`(`gerado_em`),
    INDEX `idx_rel_movimentacoes_estoque_periodo`(`data_inicio`, `data_fim`),
    PRIMARY KEY (`id_relatorio_movimentacoes_estoque`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorio_vendas_mensais` (
    `id_relatorio_vendas_mensais` BIGINT NOT NULL AUTO_INCREMENT,
    `data_inicio` DATE NOT NULL,
    `data_fim` DATE NOT NULL,
    `formato_arquivo` ENUM('EXCEL') NOT NULL DEFAULT 'EXCEL',
    `granularidade_resumo` ENUM('DIA') NOT NULL DEFAULT 'DIA',
    `incluir_faturamento` BOOLEAN NOT NULL DEFAULT true,
    `incluir_quantidade_vendida` BOOLEAN NOT NULL DEFAULT true,
    `id_administrador` INTEGER NOT NULL,
    `gerado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rel_vendas_mensais_admin`(`id_administrador`),
    INDEX `idx_rel_vendas_mensais_gerado_em`(`gerado_em`),
    INDEX `idx_rel_vendas_mensais_periodo`(`data_inicio`, `data_fim`),
    PRIMARY KEY (`id_relatorio_vendas_mensais`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token_recuperacao_senha` (
    `id_token` BIGINT NOT NULL AUTO_INCREMENT,
    `usuario_tipo` ENUM('ADMINISTRADOR', 'VENDEDOR', 'COMPRADOR') NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `data_criacao` DATETIME(0) NOT NULL,
    `data_expiracao` DATETIME(0) NOT NULL,
    `utilizado_em` DATETIME(0) NULL,

    UNIQUE INDEX `uq_token_hash`(`token_hash`),
    INDEX `idx_token_expiracao`(`data_expiracao`),
    INDEX `idx_token_usuario`(`usuario_tipo`, `usuario_id`),
    PRIMARY KEY (`id_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venda` (
    `id_venda` BIGINT NOT NULL AUTO_INCREMENT,
    `numero_pedido` VARCHAR(32) NOT NULL,
    `cpf_cliente` CHAR(11) NOT NULL,
    `id_vendedor` INTEGER NULL,
    `id_carrinho` BIGINT NULL,
    `status_pagamento` ENUM('AGUARDANDO', 'APROVADO', 'RECUSADO', 'CANCELADO', 'ESTORNADO') NOT NULL DEFAULT 'AGUARDANDO',
    `total_bruto` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_liquido` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_venda_numero_pedido`(`numero_pedido`),
    INDEX `idx_venda_carrinho`(`id_carrinho`),
    INDEX `idx_venda_cliente`(`cpf_cliente`),
    INDEX `idx_venda_datas`(`criado_em`, `atualizado_em`),
    INDEX `idx_venda_status`(`status_pagamento`),
    INDEX `idx_venda_vendedor`(`id_vendedor`),
    PRIMARY KEY (`id_venda`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venda_item` (
    `id_venda_item` BIGINT NOT NULL AUTO_INCREMENT,
    `id_venda` BIGINT NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `preco_unitario_snapshot` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `criado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_venda_item_produto`(`id_produto`),
    INDEX `idx_venda_item_venda`(`id_venda`),
    UNIQUE INDEX `uq_venda_item_produto`(`id_venda`, `id_produto`),
    PRIMARY KEY (`id_venda_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendedor` (
    `id_vendedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_completo_vendedor` VARCHAR(150) NOT NULL,
    `email_vendedor` VARCHAR(150) NOT NULL,
    `meta_mensal_vendedor` DECIMAL(10, 2) NOT NULL,
    `taxa_comissao_vendedor` DECIMAL(5, 2) NOT NULL,
    `foto_url_vendedor` VARCHAR(255) NULL,
    `ativo_vendedor` BOOLEAN NOT NULL DEFAULT true,
    `data_criacao_vendedor` DATETIME(0) NULL,
    `data_atualizacao_vendedor` DATETIME(0) NULL,

    UNIQUE INDEX `id_vendedor_UNIQUE`(`id_vendedor`),
    UNIQUE INDEX `email_vendedor_UNIQUE`(`email_vendedor`),
    INDEX `idx_vendedor_ativo`(`ativo_vendedor`),
    INDEX `idx_vendedor_datas`(`data_criacao_vendedor`, `data_atualizacao_vendedor`),
    PRIMARY KEY (`id_vendedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voucher` (
    `id_voucher` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_voucher` VARCHAR(45) NOT NULL,
    `porcentagem_desconto_voucher` INTEGER NOT NULL,
    `data_inicio_voucher` DATE NOT NULL,
    `data_validade_voucher` DATE NOT NULL,
    `descricao_voucher` VARCHAR(250) NULL,
    `status_voucher` ENUM('ATIVO', 'EXPIRADO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    `criado_em` DATETIME(0) NULL,
    `atualizado_em` DATETIME(0) NULL,
    `criado_por_id_administrador` INTEGER NULL,
    `atualizado_por_id_administrador` INTEGER NULL,

    UNIQUE INDEX `id_voucher_UNIQUE`(`id_voucher`),
    UNIQUE INDEX `codigo_voucher_UNIQUE`(`codigo_voucher`),
    INDEX `idx_voucher_atualizado_por_admin`(`atualizado_por_id_administrador`),
    INDEX `idx_voucher_criado_por_admin`(`criado_por_id_administrador`),
    INDEX `idx_voucher_status_validade`(`status_voucher`, `data_validade_voucher`),
    PRIMARY KEY (`id_voucher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `administrador` ADD CONSTRAINT `administrador_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `banner` ADD CONSTRAINT `fk_banner_atualizado_por_admin` FOREIGN KEY (`atualizado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `banner` ADD CONSTRAINT `fk_banner_criado_por_admin` FOREIGN KEY (`criado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `fk_carrinho_cliente` FOREIGN KEY (`cpf_cliente`) REFERENCES `cliente`(`cpf_cliente`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `carrinho_item` ADD CONSTRAINT `fk_carrinho_item_carrinho` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinho`(`id_carrinho`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `carrinho_item` ADD CONSTRAINT `fk_carrinho_item_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comissao_mensal_vendedor` ADD CONSTRAINT `fk_comissao_mensal_status` FOREIGN KEY (`id_status_comissao_mensal`) REFERENCES `ref_status_comissao_mensal`(`id_status_comissao_mensal`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comissao_mensal_vendedor` ADD CONSTRAINT `fk_comissao_mensal_vendedor` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor`(`id_vendedor`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cores_marca` ADD CONSTRAINT `fk_cores_marca_atualizado_por_admin` FOREIGN KEY (`atualizado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cores_marca` ADD CONSTRAINT `fk_cores_marca_criado_por_admin` FOREIGN KEY (`criado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cores_marca` ADD CONSTRAINT `fk_cores_marca_edicao_site` FOREIGN KEY (`id_edicao_site`) REFERENCES `edicao_site`(`id_edicao_site`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `edicao_site` ADD CONSTRAINT `fk_edicao_site_atualizado_por_admin` FOREIGN KEY (`atualizado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `edicao_site` ADD CONSTRAINT `fk_edicao_site_criado_por_admin` FOREIGN KEY (`criado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `geracao_relatorio` ADD CONSTRAINT `fk_geracao_relatorio_admin` FOREIGN KEY (`id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `grid` ADD CONSTRAINT `fk_grid_atualizado_por_admin` FOREIGN KEY (`atualizado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `grid` ADD CONSTRAINT `fk_grid_criado_por_admin` FOREIGN KEY (`criado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `logotipo` ADD CONSTRAINT `fk_logotipo_atualizado_por_admin` FOREIGN KEY (`atualizado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `logotipo` ADD CONSTRAINT `fk_logotipo_criado_por_admin` FOREIGN KEY (`criado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `logotipo` ADD CONSTRAINT `fk_logotipo_edicao_site` FOREIGN KEY (`id_edicao_site`) REFERENCES `edicao_site`(`id_edicao_site`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movimentacao_estoque` ADD CONSTRAINT `fk_mov_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movimentacao_estoque` ADD CONSTRAINT `fk_mov_vendedor` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor`(`id_vendedor`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `fk_produto_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `relatorio_desempenho_vendedores` ADD CONSTRAINT `fk_rel_desempenho_vendedores_admin` FOREIGN KEY (`id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `relatorio_inventario_estoque` ADD CONSTRAINT `fk_rel_inventario_estoque_admin` FOREIGN KEY (`id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `relatorio_movimentacoes_estoque` ADD CONSTRAINT `fk_rel_movimentacoes_estoque_admin` FOREIGN KEY (`id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `relatorio_vendas_mensais` ADD CONSTRAINT `fk_rel_vendas_mensais_admin` FOREIGN KEY (`id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `venda` ADD CONSTRAINT `fk_venda_carrinho` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinho`(`id_carrinho`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `venda` ADD CONSTRAINT `fk_venda_cliente` FOREIGN KEY (`cpf_cliente`) REFERENCES `cliente`(`cpf_cliente`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `venda` ADD CONSTRAINT `fk_venda_vendedor` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor`(`id_vendedor`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `venda_item` ADD CONSTRAINT `fk_venda_item_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `venda_item` ADD CONSTRAINT `fk_venda_item_venda` FOREIGN KEY (`id_venda`) REFERENCES `venda`(`id_venda`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `voucher` ADD CONSTRAINT `fk_voucher_atualizado_por_admin` FOREIGN KEY (`atualizado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `voucher` ADD CONSTRAINT `fk_voucher_criado_por_admin` FOREIGN KEY (`criado_por_id_administrador`) REFERENCES `administrador`(`id_administrador`) ON DELETE SET NULL ON UPDATE RESTRICT;

