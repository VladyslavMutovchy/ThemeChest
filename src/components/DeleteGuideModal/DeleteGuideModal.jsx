import React from 'react';
import styles from './DeleteGuideModal.module.css';
import { Button } from '../../components/UI';

const DeleteGuideModal = ({ isOpen, onClose, onConfirm, guideTitle }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Confirm Deletion</h2>
        </div>
        <div className={styles.modalContent}>
          <p className={styles.modalText}>
            Are you sure you want to delete the guide <strong>{guideTitle}</strong>?
          </p>
          <p className={styles.modalWarning}>
            This action cannot be undone. All associated chapters and themes will also be removed.
          </p>
        </div>
        <div className={styles.modalActions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGuideModal;
