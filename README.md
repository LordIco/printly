# Printly — Landing Page Comercial

Landing page oficial do Printly, publicada pelo GitHub Pages.

## Download gratuito e captura de interessados

1. Execute `supabase/01_download_leads.sql` uma vez no SQL Editor do projeto Supabase usado pela Printly Suprimentos.
2. No GitHub, abra **Releases > Draft a new release**, crie uma tag de versão e anexe o instalador `.exe` em **Attach binaries**.
3. Publique a release, copie o link direto do instalador e preencha `DOWNLOAD_URL` em `assets/js/download-config.js`.

O formulário usa a chave pública do Supabase e uma política RLS que autoriza somente inserções. Visitantes não podem consultar a lista de cadastros. Os registros ficam disponíveis no Table Editor, na tabela `download_leads`.
