# Registro do Desenvolvimento e Uso de IA

Este documento descreve as decisões técnicas, a organização do trabalho e o uso de Inteligência Artificial durante a construção da aplicação de Cadastro de Currículos.

## 1. Organização e Execução do Trabalho

O trabalho foi dividido estrategicamente em três fases:
1. **Planejamento e Arquitetura:** Discussão sobre a stack tecnológica, modelagem do banco de dados (SQL Server) e design dos fluxos de API, definindo o escopo estrito do que seria obrigatório e do que seria bônus.
2. **Execução Assistida:** Construção da aplicação começando pela infraestrutura (Docker), subindo para a API Node.js (com validações Zod e Knex) e culminando na interface React (React Query, Hook Form e CSS Modules).
3. **Refinamento e Testes:** Ajustes finos no extrator de texto do PDF (heurísticas do parser) e validações de UI/UX (Dropzone, Modal nativo, contrastes de cor).

## 2. Principais Decisões Técnicas e Motivos

- **Separação da extração do PDF do salvamento:** Criei um endpoint `POST /api/candidates/parse-pdf` separado do endpoint de criação. Assim, o backend apenas devolve as sugestões lidas e o frontend preenche a tela. Isso garante que a leitura do PDF seja estritamente um "acelerador" e nunca bloqueie o cadastro manual.
- **Validação Unificada (Zod):** Usei a mesma biblioteca de schema no Backend e no Frontend, garantindo que o que a interface bloqueia, a API também recusa.
- **Upload em Memória (RAM):** Utilizei o `multer.memoryStorage()`. Como o PDF serve apenas para extração de dados imediatos, não faz sentido guardá-lo no HD (disco) poluindo o servidor.
- **Componentes Nativos (Dialog) e CSS Modules:** Evitei bibliotecas pesadas de interface (como Material UI, Bootstrap ou Tailwind). Todo o design foi feito com CSS puro e moderno, e o Modal de detalhes utilizou o elemento semântico `<dialog>` do HTML5, garantindo leveza e acessibilidade.
- **Extração por Regras (Regex + Heurísticas) vs LLMs:** Optei por regras estruturadas usando `libphonenumber-js` e heurísticas de leitura de linhas para evitar o uso de LLMs de terceiros, garantindo performance quase instantânea e total privacidade dos dados sensíveis dos candidatos.

## 3. Ferramentas e Modelos de IA Utilizados

Utilizei duas ferramentas de IA distintas, para propósitos diferentes:
- **Claude (Anthropic - Modelo Sonnet 3.5 / 5.5):** Usado via interface web para a fase inicial de *Planejamento, Pesquisa Técnica e Arquitetura*.
- **Gemini / Antigravity IDE (Google):** Usado como assistente de *Pair Programming* no ambiente de desenvolvimento local para codificação pesada, manipulação direta de arquivos, refatorações e debug de erros do terminal.

> **Nota:** A IA foi usada estritamente como "Co-piloto" (consultora e geradora de *snippets*). A governança, as decisões finais de arquitetura, a aprovação de *Pull Requests/Commits* e os testes lógicos foram todos realizados por mim.

## 4. Etapas em que a IA ajudou e como as respostas foram aproveitadas

- **Estrutura de Pastas e Endpoints (Claude):** Sugeriu a divisão da lógica em módulos e a separação genial do endpoint `parse-pdf`. Adotei totalmente essa abordagem.
- **Pesquisa do Parser de PDF (Claude):** Fez um comparativo entre OCRs e bibliotecas estáticas, sugerindo o `unpdf` com heurísticas, o que considerei a solução mais elegante.
- **Configuração da Infra e Docker (Gemini):** Durante a criação do contêiner, enfrentamos erros de I/O com a imagem `mssql 2022` no WSL2. A IA rapidamente diagnosticou e sugeriu o downgrade seguro para a versão `2019-latest`, resolvendo a instabilidade no momento.
- **Tipagem em Monorepo (Gemini):** Quando compartilhei o Schema Zod entre Back e Front, houve um erro interno do TypeScript. A IA me sugeriu exportar a inferência `type CandidateFormData = z.infer<typeof candidateSchema>` no backend e usar `as any` ou cast no React, resolvendo a barreira.
- **Refinamento de Expressões Regulares (Gemini):** A IA ajudou a identificar por que o número de teste `(41)9 9817-1910` falhava no regex. Ela reescreveu a expressão para ser tolerante a espaços avulsos e falhas de digitação (`(?:9[\s-]*)?\d{4}[\s-]*\d{4}`).

## 5. O que precisou ser corrigido, adaptado ou descartado

- **Descarte de Features (Priorização):** Descartei a implementação de Criptografia AES, Filtros (Blind Index) e extração inteligente via NER (NLP) devido ao escopo e tempo do teste. Foquei 100% no caminho crítico obrigatório.
- **Adaptação da Biblioteca `unpdf`:** A biblioteca `pdf.js` (motor do unpdf) joga erros quando recebe a classe `Buffer` nativa do Node.js. Precisei adaptar o código (com ajuda da IA) criando uma nova instância estrita `new Uint8Array(buffer.buffer)` antes da leitura.
- **Correção da Heurística de Nome:** Inicialmente, o sistema estava confundindo os títulos "Experiência Profissional" com nomes de pessoas. Corrigi isso alimentando a lista negra (ignore list) do parser com mais de 30 palavras-chave comuns em títulos de currículo.

## 6. Como verifiquei se a solução estava correta

- **Teste End-to-End Manual:** Realizei o fluxo completo: iniciar o servidor, preencher o formulário manualmente e verificar se a listagem atualizava via React Query sem recarregar a tela.
- **Simulação de Erros:** Tentei salvar textos maiores que 100 caracteres no Cargo para forçar o limite da Migration no SQL Server, garantindo que o Zod barrava corretamente no formulário.
- **Teste Extremo do PDF:** Submeti um currículo PDF real/fictício fora dos padrões perfeitos e conferi console a console se a Regex limpava corretamente ejetando no front-end os valores prontos.

## 7. Tempo aproximado dedicado

Aproximadamente 2 horas de planejamento mais 6 horas de desenvolvimento com auxilio de IA.
Totalizando aproximadamente 8 horas de desenvolvimento.

## 8. Dificuldades, limitações e melhorias com mais tempo

**Dificuldades:** 
Lidar com as tipagens estritas no compartilhamento de código (monorepo) entre a API e o React, e fazer o motor interno da Mozilla (`pdf.js`) ler arquivos nativos em memória no Node sem recorrer ao File System.

**Melhorias que eu faria com mais tempo:**
1. **Segurança (AES-GCM):** Criptografar os dados pessoais (telefone, e-mail) no banco de dados para proteção em repouso.
2. **Sistema NER:** Integrar o Transformers.js local para capturar o nome do candidato com IA sem precisar de Expressões Regulares falhas.
3. **Busca e Filtros:** Implementar a barra de pesquisa na listagem dos candidatos.
4. **Testes Automatizados:** Cobrir o `contact.parser.ts` com testes unitários no Jest para diversos formatos de currículo.
