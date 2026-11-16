# Site Darlan Hora

Site da marca Darlan Hora (criação de sites), no ar em [darlanhora.com.br](https://darlanhora.com.br). HTML, CSS e JavaScript puros, sem instalação e sem etapa de build.

## Estrutura

- `index.html`: a página principal (início, serviços, sobre, portfólio, preços, calculadora, como funciona, dúvidas, contato, rodapé).
- `privacidade.html`: aviso de privacidade, ligado no rodapé e no formulário de contato.
- `404.html`: página mostrada quando o endereço não existe.
- `css/style.css`: estilos gerais da página principal, animação do topo e ajustes para celular. A maior parte do visual está em `style="..."` direto no HTML.
- `js/main.js`: calculadora de orçamento, menu do celular, validação do e-mail, checagem do consentimento e montagem da mensagem do WhatsApp. Os preços ficam no começo do arquivo.
- `assets/foto-darlan.jpg`: foto da seção Sobre.
- `assets/og-image.jpg`: imagem que aparece quando o link é compartilhado no WhatsApp, Instagram e afins.
- `robots.txt`: libera o site para buscadores e indica o sitemap.
- `sitemap.xml`: lista as páginas para o Google.
- `canvas/`: o mesmo site no formato do canvas de design do Claude, onde ele foi desenhado (página principal, aviso de privacidade e 404), e a foto original. Esses arquivos não rodam sozinhos num navegador; servem de fonte para gerar o site.

## Como ver no computador

Abra o `index.html` no navegador. A `404.html` usa o endereço `/` no botão de voltar, então esse botão só funciona com o site publicado.

## Como publicar

O site está hospedado na Cloudflare (Worker `darlanhora`). Para publicar uma versão nova, use **Nova implantação** no Worker e envie os arquivos do site (tudo, menos a pasta `canvas` e este README).

## Pendências

- O formulário só libera o envio depois que a pessoa marca que leu o aviso de privacidade.
- O formulário não salva os pedidos. Ele só abre o WhatsApp com a mensagem pronta.
- Se o site ganhar estatísticas de acesso, cookies ou outra hospedagem, atualizar o `privacidade.html`.
