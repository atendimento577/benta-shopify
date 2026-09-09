# Benta — Tema Shopify (v2)

Tema Shopify (Online Store 2.0) da **Benta**, licor fino de coco. Landing page
de produto único: hero, marquee, grade de informações, história da marca,
bloco de compra e receitas — mais as páginas nativas de produto e carrinho.

**Stack:** Shopify · Liquid · Online Store 2.0 · CSS · Vanilla JavaScript.

## Como usar

Pré-requisitos: [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) instalado
e acesso a uma loja Shopify (ou uma development store).

```bash
# Rodar localmente com hot reload (preview ao vivo)
shopify theme dev --store SUA-LOJA.myshopify.com

# Subir para a loja (como tema não publicado / rascunho)
shopify theme push --store SUA-LOJA.myshopify.com --unpublished

# Validar o código (lint oficial do Shopify)
shopify theme check
```

## Estrutura de pastas

```
layout/      → theme.liquid (header, footer e content_for_layout)
templates/   → index.json (home), product.json, cart.json
sections/    → hero, marquee, info-grid, story, product-buy, recipes,
               main-product, main-cart
assets/      → theme.css, theme.js e imagens do produto
config/      → settings do tema (nome/versão/autor)
locales/     → textos traduzíveis (pt-BR)
```

### `sections/`

| Arquivo | Função |
|---|---|
| `hero.liquid` | Seção de abertura da home (imagem + chamada principal) |
| `marquee.liquid` | Faixa de texto em movimento |
| `info-grid.liquid` | Grade de destaques/benefícios do produto |
| `story.liquid` | Bloco de história da marca |
| `product-buy.liquid` | Bloco de compra na home |
| `recipes.liquid` | Receitas com o produto |
| `main-product.liquid` | Conteúdo principal da página de produto |
| `main-cart.liquid` | Conteúdo principal do carrinho |

## Licença

Uso restrito ao projeto Benta.
