# Printly — Landing Page Comercial

Landing page oficial do Printly, publicada pelo GitHub Pages.

## Download gratuito e captura de interessados

1. Execute `supabase/01_download_leads.sql` uma vez no SQL Editor do projeto Supabase usado pela Printly Suprimentos.
2. Envie o instalador para uma URL pública (GitHub Release, storage ou CDN).
3. Preencha `DOWNLOAD_URL` em `assets/js/download-config.js`.

O formulário usa a chave pública do Supabase e uma política RLS que autoriza somente inserções. Visitantes não podem consultar a lista de cadastros. Os registros ficam disponíveis no Table Editor, na tabela `download_leads`.
