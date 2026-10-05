import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useCandidates } from '../hooks/useCandidates';

import { Users, Mail, Phone } from 'lucide-react';

import styles from './CandidateList.module.css';

export const CandidateList: React.FC = () => {
  const { data: candidates, isLoading, isError } = useCandidates();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className={styles.emptyState}>Carregando candidatos...</div>;
  }

  if (isError) {
    return <div className={styles.emptyState} style={{ color: 'var(--danger)' }}>Erro ao carregar os candidatos.</div>;
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className={`glass-panel ${styles.emptyState}`}>
        <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
        <h3>Nenhum candidato cadastrado</h3>
        <p>Preencha o formulário acima para registrar o primeiro candidato.</p>
      </div>
    );
  }

  return (

    <div className={styles.listContainer}>

      <h2 className={styles.title}>
        <Users size={24} /> Candidatos Registrados ({candidates.length})
      </h2>

      <div className={styles.grid}>

        {candidates.map(candidate => (
          <div
            key={candidate.Id}
            className={`glass-panel ${styles.card}`}
            onClick={() => navigate(`/candidatos/${candidate.Id}`)}
          >
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.name}>{candidate.FullName}</div>
                <div className={styles.role}>{candidate.DesiredRole || 'Cargo não informado'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className={styles.infoRow}>
                <Mail size={16} />
                {candidate.Email}
              </div>
              <div className={styles.infoRow}>
                <Phone size={15} />
                {candidate.Phone || 'Telefone não informado'}
              </div>
            </div>
          </div>
        ))}

      </div>

    </div>

  );
};
