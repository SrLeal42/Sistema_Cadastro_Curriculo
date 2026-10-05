import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useCandidate } from '../hooks/useCandidates';

import { X, Mail, Phone, Calendar, FileText } from 'lucide-react';

import styles from './CandidateModal.module.css';

export const CandidateModal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: candidate, isLoading, isError } = useCandidate(id);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Show modal when component mounts (route is matched)
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }

    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [id]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    navigate('/');
  };

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  if (!id) return null;

  return (

    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClick={handleBackdropClick}
      onClose={handleClose}
    >

      <div className={`glass-panel ${styles.modalContent}`}>

        <button className={styles.closeButton} onClick={handleClose} aria-label="Fechar">
          <X size={24} />
        </button>

        {isLoading && <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando detalhes...</div>}

        {isError && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>Erro ao carregar dados do candidato.</div>}

        {candidate && (
          <>
            <div className={styles.header}>
              <h2 className={styles.name}>{candidate.FullName}</h2>
              {candidate.DesiredRole && (
                <span className={styles.role}>{candidate.DesiredRole}</span>
              )}
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>E-mail</span>
                <span className={styles.detailValue}>
                  <Mail size={16} />
                  {candidate.Email}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Telefone</span>
                <span className={styles.detailValue}>
                  <Phone size={16} />
                  {candidate.Phone || 'Não informado'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Data de Cadastro</span>
                <span className={styles.detailValue}>
                  <Calendar size={16} />
                  {candidate.CreatedAt ? new Date(candidate.CreatedAt).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
            </div>

            <div className={styles.summarySection}>
              <h3 className={styles.summaryTitle}>
                <FileText size={18} /> Resumo Profissional
              </h3>
              <p className={styles.summaryText}>
                {candidate.Summary || 'Nenhum resumo fornecido pelo candidato.'}
              </p>
            </div>
          </>
        )}

      </div>

    </dialog>

  );
};
