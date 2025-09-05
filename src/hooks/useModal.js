import { useState } from 'react';

export const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    buttons: []
  });

  const showModal = (title, message, type = 'info', buttons = []) => {
    setModalConfig({
      title,
      message,
      type,
      buttons
    });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const showAlert = (title, message, buttons = []) => {
    showModal(title, message, 'info', buttons);
  };

  const showConfirm = (title, message, onConfirm, onCancel) => {
    showModal(title, message, 'warning', [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: () => {
          hideModal();
          if (onCancel) onCancel();
        }
      },
      {
        text: 'Confirmar',
        style: 'default',
        onPress: () => {
          hideModal();
          if (onConfirm) onConfirm();
        }
      }
    ]);
  };

  const showError = (title, message, onOk) => {
    showModal(title, message, 'error', [
      {
        text: 'OK',
        style: 'default',
        onPress: () => {
          hideModal();
          if (onOk) onOk();
        }
      }
    ]);
  };

  const showSuccess = (title, message, onOk) => {
    showModal(title, message, 'success', [
      {
        text: 'OK',
        style: 'default',
        onPress: () => {
          hideModal();
          if (onOk) onOk();
        }
      }
    ]);
  };

  return {
    modalVisible,
    modalConfig,
    showModal,
    hideModal,
    showAlert,
    showConfirm,
    showError,
    showSuccess
  };
};
