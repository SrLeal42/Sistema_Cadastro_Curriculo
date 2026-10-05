import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries to prevent duplicates
  await knex("Candidates").del();

  // Inserts seed entries
  await knex("Candidates").insert([
    {
      FullName: "João Gabriel Leal",
      Email: "joaogabrielleal@exemplo.com",
      Phone: "(67) 96666-7777",
      DesiredRole: "Desenvolvedor Full-Stack",
      Summary: "Estudante de Ciência da Computação com experiência prática em desenvolvimento full-stack com Python/Flask. Buscando oportunidade de estágio ou vaga júnior em desenvolvimento de software."
    },
    {
      FullName: "Ana Carolina Souza",
      Email: "ana.carolina.dev@exemplo.com",
      Phone: "(11) 98888-7777",
      DesiredRole: "Desenvolvedora Frontend Pleno",
      Summary: "Especialista em React e Tailwind CSS. 4 anos de experiência criando interfaces dinâmicas e acessíveis. Apaixonada por UX/UI e micro-interações."
    },
    {
      FullName: "Marcos Oliveira",
      Email: "marcos.oliveira@exemplo.com",
      Phone: "(21) 97777-6666",
      DesiredRole: "Engenheiro de Dados",
      Summary: "Profissional certificado Oracle com vivência em pipelines de dados, ETL e MongoDB. Buscando migração para arquitetura de nuvem."
    }
  ]);
}
