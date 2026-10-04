# Sistema_Cadastro_Curriculo

# Contexto do projeto: Cadastro de candidatos com leitura de currículo em PDF

## Objetivo
Desafio técnico de entrevista de emprego. Aplicação web simples, mas bem feita, para a equipe de recrutamento cadastrar e consultar candidatos. Sem login e sem cadastro de usuário.

## Stack (definida)
- **Frontend:** React + Vite + TypeScript, CSS puro (sem Tailwind/UI kits), `react-hook-form` + `zod`, `@tanstack/react-query`, `react-router` (rota do modal), `react-dropzone` (opcional).
- **Backend:** Node.js + TypeScript + Express 5, `multer` (upload em memória, limite 5 MB), `zod`, `unpdf` (texto do PDF), `libphonenumber-js` (telefone, região BR).
- **Banco:** SQL Server (Docker, `mcr.microsoft.com/mssql/server`), driver `mssql`, migrations com **Knex**.
- **Infra:** `docker-compose` para o SQL Server; README com instruções de execução e decisões técnicas.

## Requisitos funcionais
- **Tela única:** formulário + campo de upload de PDF no topo; abaixo, listagem dos candidatos cadastrados. Atualização sem refresh (React Query com `invalidateQueries` após salvar).
- **Dois caminhos de cadastro, mesmo formulário e mesmas validações:**
  1. Manual: preencher e salvar, sem PDF.
  2. Com PDF: o backend extrai o texto e sugere nome, e-mail e telefone; o formulário é preenchido e pode ser corrigido ou complementado antes de salvar. Valores já digitados não são apagados em campos que o PDF não trouxer.
- **PDF é opcional:** ausência do arquivo ou falha na leitura nunca bloqueia o cadastro manual (só exibe aviso).
- **Campos:** nome completo (obrigatório), e-mail (obrigatório, formato válido), telefone, área/cargo de interesse, resumo profissional.
- **Detalhes:** clicar num candidato abre um modal (`<dialog>`) com URL própria `/candidatos/:id`, que funciona também em acesso direto e F5.
- **Mensagens claras:** arquivo inválido, arquivo grande demais, falha na leitura do PDF, erro de validação e cadastro salvo (toast ou banner).
- **Design:** simples, elegante e responsivo (card centralizado; tabela no desktop, cards no mobile).

## Arquitetura
```
backend/src/
  config/ (env, conexão)  db/migrations/
  modules/candidates/ (routes, controller, service, repository, schema.zod)
  modules/pdf/ (pdf.extractor.ts, contact.parser.ts)
  shared/crypto.ts  middlewares/ (upload, erros)
frontend/src/
  components/ (CandidateForm, PdfDropzone, CandidateList, CandidateModal)
  hooks/useCandidates.ts  services/api.ts
```

**Decisão-chave:** separar "ler o PDF" de "salvar o candidato".
- `POST /api/candidates/parse-pdf`: recebe o arquivo, devolve só os campos sugeridos, não grava nada.
- `POST /api/candidates`: salva (vindo do PDF ou manual), com o mesmo schema zod.
- `GET /api/candidates` e `GET /api/candidates/:id`: listagem e detalhes.

**Validação do arquivo:** limite de 5 MB, mimetype `application/pdf` **e** bytes iniciais `%PDF-`; tratar PDF protegido por senha e PDF sem texto (escaneado) como "falha na leitura". Erros com códigos como `INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `PDF_READ_FAILED`, `VALIDATION_ERROR`, que o front traduz em mensagens.

## Extração de dados do PDF
Abordagem **por regras**, sem IA, no caminho principal:
- **E-mail:** regex.
- **Telefone:** regex candidata + validação com `libphonenumber-js` (BR).
- **Nome:** heurística nas primeiras linhas (descarta linhas com e-mail, telefone, URL, números ou palavras como "currículo/resumo/objetivo"; pega a primeira linha com 2 a 5 palavras em formato de nome). Fallback: sugerir a partir do e-mail.
- Como o formulário é editável, errar o nome é aceitável.
- Estruturar atrás de uma interface `ContactExtractor`, para permitir uma implementação opcional com NER (Transformers.js, modelo multilíngue, só o nome, atrás de `ENABLE_NER=true`). Só entra se sobrar tempo e se melhorar o resultado nos currículos de teste. LLM local (Ollama) e APIs externas foram descartados (instalação extra e dados pessoais enviados a terceiros).

## Banco de dados
Tabela `Candidates`: `Id`, `FullName`, `Email` (cifrado), `EmailHash` (opcional, índice único), `Phone` (cifrado), `DesiredRole`, `Summary`, `CreatedAt`.

## Criptografia (ideia do desenvolvedor)
- **AES-256-GCM** com `node:crypto`, IV aleatório por registro, guardando `iv + authTag + ciphertext`; chave em variável de ambiente (`.env.example` sem o valor real).
- Cifrar **e-mail e telefone**. Nome, cargo e resumo ficam em claro, para permitir filtros.
- **Blind index** (bônus): `HMAC-SHA256` do e-mail normalizado (`trim` + minúsculas), com chave diferente da criptografia, em coluna com índice único para impedir duplicados; capturar o erro de índice único (2601/2627) e responder "e-mail já cadastrado".
- No README: protege dados em repouso, não em trânsito (HTTPS) nem contra quem tiver a chave; em produção a chave iria para um cofre; não logar dados pessoais.

## Prioridades (prazo curto)
**Obrigatório (fazer primeiro, nesta ordem):**
1. `docker-compose` + migration + conexão com o banco.
2. `POST`/`GET` de candidatos com validação zod.
3. Formulário + listagem no front, com atualização sem refresh.
4. Upload + `parse-pdf` + parser de e-mail, telefone e nome por regras.
5. Modal de detalhes em `/candidatos/:id`.
6. Mensagens de erro/sucesso e visual responsivo.
7. README (como rodar + decisões).

**Se sobrar tempo (nesta ordem):**
1. Criptografia AES-GCM de e-mail e telefone.
2. Blind index para e-mail duplicado.
3. Filtros: um campo de busca `q` (nome, cargo, resumo via `LIKE`, parametrizado), com debounce de 300 ms e filtros na URL.
4. Testes do parser com 3 a 5 PDFs de exemplo.
5. NER opcional com `ENABLE_NER`.

**Fora de escopo:** login, OCR, paginação avançada, Full-Text Search, deploy.