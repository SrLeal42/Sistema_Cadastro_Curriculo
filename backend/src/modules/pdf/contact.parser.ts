import { parsePhoneNumberFromString } from 'libphonenumber-js';

export interface ParsedContactInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  summary: string;
}

export const parseResumeText = (text: string): ParsedContactInfo => {
  const result: ParsedContactInfo = {
    summary: text,
  };

  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    result.email = emailMatch[1].trim();
  }

  const phoneCandidates = text.match(/(?:\+?55\s*)?(?:\(?0?\d{2}\)?[\s-]*)?(?:9[\s-]*)?\d{4}[\s-]*\d{4}/g);

  if (phoneCandidates) {
    for (const candidate of phoneCandidates) {
      const phoneNumber = parsePhoneNumberFromString(candidate, 'BR');
      if (phoneNumber && phoneNumber.isValid()) {
        result.phone = phoneNumber.formatNational();
        break;
      }
    }
  }

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Lista expandida de palavras-chave comuns em títulos de currículo
  const ignoreKeywords = [
    'currículo', 'curriculo', 'resume', 'objetivo', 'dados', 'pessoais', 
    'contato', 'perfil', 'telefone', 'e-mail', 'email', 'experiência', 
    'experiencia', 'profissional', 'formação', 'formacao', 'competências', 
    'competencias', 'idiomas', 'cursos', 'complementares', 'habilidades', 
    'educação', 'educacao', 'projetos', 'certificações', 'certificacoes', 
    'resumo', 'portfólio', 'portfolio', 'github', 'linkedin'
  ];

  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Ignora linhas contendo números (telefones, CPFs), URLs, o e-mail encontrado ou palavras-chave de seção
    if (
      emailRegex.test(line) ||
      /\d/.test(line) ||
      lowerLine.includes('http') ||
      lowerLine.includes('www') ||
      ignoreKeywords.some(kw => lowerLine.includes(kw))
    ) {
      continue;
    }

    const words = line.split(/\s+/);
    // Verifica se as palavras contêm apenas letras (incluindo acentos brasileiros)
    const hasOnlyLetters = words.every(word => /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(word));

    // Um nome brasileiro completo costuma ter entre 2 e 5 palavras
    if (words.length >= 2 && words.length <= 5 && hasOnlyLetters) {
      // Formata como Nome Próprio (Title Case) e sai do loop
      result.fullName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      break;
    }
  }

  // Fallback: Se a heurística não achou o nome, tentamos extrair o nome a partir do e-mail
  if (!result.fullName && result.email) {
    const emailNamePart = result.email.split('@')[0];
    result.fullName = emailNamePart.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  return result;
};
