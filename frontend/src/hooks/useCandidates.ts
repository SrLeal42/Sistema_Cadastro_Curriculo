import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCandidates, fetchCandidateById, createCandidate, parsePdfRequest, type Candidate } from "../services/api";

export const useParsePdf = () => {
  return useMutation({
    mutationFn: (file: File) => parsePdfRequest(file),
  });
};

export const useCandidates = () => {
  return useQuery<Candidate[], Error>({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  });
};

export const useCandidate = (id: string | undefined) => {
  return useQuery<Candidate, Error>({
    queryKey: ["candidate", id],
    queryFn: () => fetchCandidateById(id!),
    enabled: !!id, // Only runs the query if the ID exists
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCandidate: Partial<Candidate>) => createCandidate(newCandidate),
    onSuccess: () => {
      // Quando salvar com sucesso, atualiza a lista de candidatos instantaneamente
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
};
