# Printly — auditoria e preparação de revisão do site
Data: 2026-11-26
Branch: `preview/site-revisao-conversao-20261126`

## Regra de publicação
Nenhuma alteração desta branch deve ser mesclada na `main` antes de concluir a auditoria e a integração final dos materiais PDF PT/EN/ES e seus fluxos de entrega. Publicar uma vez depois da validação.

## Escopo aprovado
- Preservar o site em produção, identidade dark/ciano, desktop e mobile já aprovados.
- Manter vídeo, simulador de custos, formulários atuais, teste de 15 dias e downloads.
- Corrigir legibilidade, clareza comercial, contato e autoatendimento.
- Incluir e-books somente após completar o site e testar o fluxo de leads.

## Auditoria por evidência (repositório + páginas públicas)
1. **Título ambíguo (P1)**: PT/EN/ES associavam uma impressora trabalhando ao desaparecimento da margem. Foi substituído por benefícios afirmativos e claros.
2. **Contato antigo (P1)**: páginas principais PT/EN/ES, termos e privacidade ainda citavam `icolabsbr@gmail.com`. Foi substituído por `contato@useprintly.com.br`, cujo recebimento por Cloudflare já foi testado.
3. **Legibilidade e acessibilidade (P1)**: tipografia secundária clara sobre fundo tecnológico; introduzidos reforço de contraste, foco visível por teclado, superfícies mais sólidas em FAQ e respeito a preferências de movimento reduzido.
4. **Autoatendimento (P1)**: foi adicionado em PT/EN/ES um item FAQ com links para manuais de instalação/uso e informação transparente sobre ausência de chat em tempo real.
5. **Diferentes experiências PT versus EN/ES (P2)**: PT contém vídeo, calculadora no hero, blocos detalhados e mais seções; EN/ES usam imagem estática no hero e conteúdo mais condensado. Decidir a localização do vídeo e da calculadora, evitando inserir narração em português nas páginas internacionais sem adaptação.
6. **Jornada extensa (P2)**: 19 seções HTML e 11 itens FAQ no PT após ajuste, contra 9 seções e 6 FAQs por idioma nas páginas EN/ES. Recomendada navegação progressiva e redução editorial sem ocultar informação técnica importante nem prejudicar SEO.
7. **Analítica de conversão (P2)**: não foi identificada instrumentação explícita de eventos nos scripts principais inspecionados. Preparar plano de medição e atualizar consentimento antes de ativar tracking.
8. **Arquivos de download (verificado)**: seis manuais PT/EN/ES apontados nas páginas existem no diretório `downloads`.
9. **Estrutura HTML (verificado por contagem)**: 1 H1 por idioma, tags principais equilibradas, sem IDs duplicados nos documentos inspecionados.
10. **Segurança comercial (P1)**: preservar fluxo existente de download/Supabase e não expor chaves de API de envio do Resend em JavaScript de navegador.

## Arquivos já preparados na branch
- `index.html`: H1, subtítulo, descrição SEO, contato e FAQ.
- `en/index.html`: mesma abordagem em inglês.
- `es/index.html`: mesma abordagem em espanhol.
- `privacidade.html` e `termos.html`: endereço institucional.
- `assets/css/styles.css`: foco, contraste e movimento reduzido.

## Pendências para a publicação única
- [ ] Testar visualmente a branch em larguras 360, 390, 768, 1024 e desktop; verificar menu, vídeo, simulador, cards e CTA flutuante.
- [ ] Verificar fluxo real de cadastro/teste e links finais com navegação em navegador.
- [ ] Revisar consistência comercial PT/EN/ES (idioma de vídeo, disponibilidade Windows/macOS Intel, preços, FAQs).
- [ ] Avaliar simplificação editorial das seções de produto a partir de comportamento real dos visitantes; evitar remover conteúdo de SEO sem medida.
- [ ] Definir métrica de conversão e regras de privacidade.
- [ ] Integrar os três PDFs do e-book, formulário com consentimento, envio seguro por Resend e download de confirmação.
- [ ] Validar DNS/email e URLs públicos após mesclar.
- [ ] Mesclar a branch na `main` apenas quando tudo estiver testado.

## Observações
Auditoria de repositório e da versão pública; não constitui teste ponta-a-ponta no navegador nem validação de analytics. Nenhum PDF do e-book foi publicado neste estágio.
