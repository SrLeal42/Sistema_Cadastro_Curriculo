const API_URL = "http://localhost:3000/api";

export interface Candidate {
  Id?: string;
  FullName: string;
  Email: string;
  Phone?: string;
  DesiredRole?: string;
  Summary?: string;
  CreatedAt?: string;
}

export const fetchCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch(`${API_URL}/candidates`);
  if (!response.ok) {
    throw new Error("Erro ao buscar candidatos");
  }
  return response.json();
};

export const fetchCandidateById = async (id: string): Promise<Candidate> => {
  const response = await fetch(`${API_URL}/candidates/${id}`);
  if (!response.ok) {
    throw new Error("Candidato não encontrado");
  }
  return response.json();
};

export const createCandidate = async (data: Partial<Candidate>): Promise<{ id: string }> => {
  const response = await fetch(`${API_URL}/candidates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: data.FullName,
      email: data.Email,
      phone: data.Phone,
      desiredRole: data.DesiredRole,
      summary: data.Summary,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao salvar candidato");
  }
  
  return response.json();
};

export interface ParsedResume {
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
}

export const parsePdfRequest = async (file: File): Promise<ParsedResume> => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/candidates/parse-pdf`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Erro ao processar o PDF.");
  }
  
  return response.json();
};
