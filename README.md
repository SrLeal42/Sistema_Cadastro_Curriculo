# Sistema de Cadastro de Currículos

Uma aplicação web full-stack desenvolvida como desafio técnico para recrutamento e cadastro de candidatos. A aplicação oferece suporte a cadastro manual ou upload de currículo em PDF com extração inteligente e automática de dados estruturados (Nome, E-mail e Telefone).

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, React Router, CSS Modules, React Hook Form, Zod, React Query, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript, Zod, Multer (Upload em RAM), unpdf (Extração do texto), libphonenumber-js (Regex avançado).
- **Banco de Dados:** SQL Server 2019 (via Docker), Knex.js (Query Builder e Migrations).

## Pré-requisitos

Para rodar o projeto localmente, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/) (Versão 18 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

## Configuração do Banco de Dados (SQL Server)

1. Na raiz do projeto, inicie o container do SQL Server em background:
   ```bash
   docker-compose up -d
   ```
   > *Nota:* O Docker irá baixar a imagem oficial do SQL Server e iniciar o banco na porta padrão (1433).

2. Abra um terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```

3. Configure as credenciais criando um arquivo `.env`. Para facilitar a avaliação, o `.env.example` já possui as credenciais que combinam exatamente com o nosso Docker:
   ```bash
   cp .env.example .env
   ```

4. Instale as dependências e rode as Migrations do Knex para criar a estrutura (Tabela `Candidates`):
   ```bash
   npm install
   npm run migrate
   ```

5. **(Opcional) Popular Banco com Dados:** Se quiser que a listagem já venha com candidatos, rode a Seed:
   ```bash
   npm run seed
   ```

---

## Executando a Aplicação

A aplicação possui a estrutura dividida em duas pastas (`backend` e `frontend`). Após ter o banco rodando, você precisará de dois terminais abertos.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
> O servidor da API iniciará na porta `3000`.

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
> O Vite iniciará o frontend. Acesse em seu navegador através de `http://localhost:5173`.

---

## Como Testar a Aplicação

1. Acesse o frontend através da porta `5173`.
2. **Cadastro Manual:** Preencha os campos obrigatórios (Nome, E-mail) e clique em "Salvar Candidato". A listagem logo abaixo atualizará instantaneamente sem piscar a tela (React Query).
3. **Upload de PDF:** 
   - Clique na "Dropzone" (área pontilhada) no topo do formulário.
   - Utilize o arquivo PDF fictício incluído (ou qualquer currículo real em formato PDF) para testar a extração.
   - Observe os dados (Nome, E-mail, Telefone formatado e Resumo) sendo extraídos e "digitados" magicamente no formulário através de expressões regulares, **sem salvar diretamente no banco**.
   - Altere ou revise as informações e conclua o cadastro.
4. **Visualização:** Na lista de candidatos, clique sobre qualquer Card. Um Modal moderno nativo do HTML (`<dialog>`) abrirá mostrando os detalhes completos, refletindo a nova rota `/candidatos/:id`.

> *Nota sobre testes automatizados:* Devido ao prazo estipulado para a entrega, o foco da arquitetura foi na entrega funcional Full-Stack. A validação do parser de PDF, tratamento de erros E2E e persistência de dados no banco foram rigorosamente testados de maneira manual através da interface e debug console.

---

## Documentação de Decisões e Uso de IA

Todas as decisões arquiteturais (como uso do `<dialog>`, CSS Modules, Separação de rotas, etc.), os desafios enfrentados e a forma transparente de como a **Inteligência Artificial** foi empregada no planejamento e no desenvolvimento em pares deste projeto estão detalhadamente descritas no arquivo obrigatório do desafio:

👉 **[Ler Arquivo DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md)**