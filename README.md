# Tutticell

Site da Tutticell Eletrônicos e Acessórios, Campinas. Página estática em português, responsiva, com fotografias reais no catálogo, atendimento guiado em três etapas e solicitações pelo WhatsApp.

## Desenvolvimento

Requer Node.js 20 ou superior. Sem pacotes de terceiros para instalar.

```sh
npm run dev
npm test
npm run build
```

A prévia abre em `http://127.0.0.1:4173`. O build gera `dist/`, configurado em `vercel.json` para a integração Git existente. O HTML também funciona diretamente em um navegador com todos os arquivos e assets ao seu lado.

## Experiência

- Diagnóstico guiado: tipo de problema, sintoma e aparelho. Preenche o formulário e organiza a mensagem; o diagnóstico técnico continua no atendimento da loja.
- Catálogo: seis categorias, busca sem distinção de acentos, filtros, detalhes com fotografia e seleção de interesses em uma única mensagem.
- Mensagem editável e cópia antes de abrir o WhatsApp. Nenhuma mensagem é enviada automaticamente.
- Horário calculado em `America/Sao_Paulo`, navegação por teclado, diálogos nativos e preferência por movimento reduzido.
- Sem contas, serviços de IA, rastreamento ou banco de dados. Os formulários ficam na memória da página até o visitante abrir o WhatsApp.

`logic.js` reúne telefone, catálogo, sintomas e horários. `app.js` controla as interações. `styles.css` define o visual principal e `experience.css` os componentes de atendimento e catálogo. Testes de regras, limites de horários e integridade de arquivos em `tests/logic.test.cjs`.

## Créditos das imagens

As fotografias reais representam as categorias do catálogo, sem afirmar estoque de marcas ou modelos específicos. Créditos e páginas de licença abaixo; não aparecem como avisos no fluxo do visitante.

| Arquivo | Fotógrafo e origem |
| --- | --- |
| `assets/capas.jpg` | [Behar Zenuni / Unsplash](https://unsplash.com/photos/four-assorted-color-smartphone-cases-x86l1G0G4BQ) |
| `assets/carregadores.jpg` | [Andrey Matveev / Pexels](https://www.pexels.com/photo/white-mobile-charger-and-cable-on-a-grey-surface-37421859/) |
| `assets/fones.jpg` | [Totte Annerbrink / Unsplash](https://unsplash.com/photos/black-wireless-headphones-NehdOHCXsjs) |
| `assets/baterias.jpg` | [Zulfugar Karimov / Unsplash](https://unsplash.com/photos/several-old-mobile-phone-batteries-on-a-white-surface-gYZHaBjGBbc) |
| `assets/powerbank.jpg` | [Atharva Whaval / Unsplash](https://unsplash.com/photos/black-iphone-5-c-beside-white-usb-cable-fhv8SNVP7XE) |
| `assets/aparelhos.jpg` | [Kaboompics / Pexels](https://www.pexels.com/photo/smartphone-and-charger-usb-connector-on-wooden-table-4195333/) |

[Licença Unsplash](https://unsplash.com/license) · [Licença Pexels](https://www.pexels.com/license/). O render do celular desmontado (`assets/celular.png`) foi criado com a ferramenta integrada de geração de imagens na primeira versão. As imagens do catálogo são fotografias de bancos de imagens, sem geração por IA.
