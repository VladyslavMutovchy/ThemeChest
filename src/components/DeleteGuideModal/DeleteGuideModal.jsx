import React from 'react';
import styles from './DeleteGuideModal.module.css';

const DeleteGuideModal = ({ isOpen, onClose, onConfirm, guideTitle }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the guide <strong>{guideTitle}</strong>? All associated chapters and themes will also be removed.
        </p>
        <div className={styles.modal_actions}>
          <button className={styles.btn_secondary} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.btn_danger} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGuideModal;
