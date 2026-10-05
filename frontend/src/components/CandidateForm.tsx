import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateCandidate } from '../hooks/useCandidates';

import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { candidateSchema, type CandidateFormData } from '../../../backend/src/modules/candidates/schema.zod';

import styles from './CandidateForm.module.css';

export const CandidateForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema)
  });

  const createCandidate = useCreateCandidate();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = (data: CandidateFormData) => {
    setErrorMsg("");

    const payload = {
      FullName: data.fullName,
      Email: data.email,
      Phone: data.phone,
      DesiredRole: data.desiredRole,
      Summary: data.summary
    };

    createCandidate.mutate(payload, {
      onSuccess: () => {
        setSuccessMsg("Candidato salvo com sucesso!");
        reset();
        setTimeout(() => setSuccessMsg(""), 3000);
      },
      onError: (error: any) => {
        setErrorMsg(error.message || "Erro desconhecido ao salvar");
      }
    });

  };

  return (

    <div className={`glass-panel ${styles.formContainer}`}>

      <h2 className={styles.title}>
        Cadastro de Candidato
      </h2>

      {successMsg && (
        <div className={styles.successMessage}>
          <CheckCircle2 size={20} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className={styles.errorMessage}>
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.row}>
          <div>
            <label>Nome Completo *</label>
            <input type="text" placeholder="Ex: João da Silva" {...register("fullName")} />
            {errors.fullName && <span className={styles.errorText}><AlertCircle size={14} /> {errors.fullName.message}</span>}
          </div>
          <div>
            <label>E-mail *</label>
            <input type="email" placeholder="joao@exemplo.com" {...register("email")} />
            {errors.email && <span className={styles.errorText}><AlertCircle size={14} /> {errors.email.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <label>Telefone</label>
            <input type="text" placeholder="(11) 99999-9999" {...register("phone")} />
          </div>
          <div>
            <label>Cargo Desejado</label>
            <input type="text" placeholder="Ex: Desenvolvedor Frontend" {...register("desiredRole")} />
          </div>
        </div>

        <div>
          <label>Resumo Profissional</label>
          <textarea rows={4} placeholder="Breve descrição sobre a experiência do candidato..." {...register("summary")} />
        </div>

        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={createCandidate.isPending}>
            {createCandidate.isPending ? 'Salvando...' : (
              <>
                <Send size={18} /> Salvar Candidato
              </>
            )}
          </button>
        </div>
      </form>

    </div>

  );
};
