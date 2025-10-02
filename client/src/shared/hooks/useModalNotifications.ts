import { useState } from "react";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
}

interface UseModalNotificationsReturn {
  successModal: ModalState;
  errorModal: ModalState;
  showSuccess: (title: string, message: string, buttonText?: string) => void;
  showError: (title: string, message: string, buttonText?: string) => void;
  closeSuccess: () => void;
  closeError: () => void;
}

export function useModalNotifications(): UseModalNotificationsReturn {
  const [successModal, setSuccessModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    buttonText: undefined,
  });

  const [errorModal, setErrorModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    buttonText: undefined,
  });

  const showSuccess = (title: string, message: string, buttonText?: string) => {
    setSuccessModal({
      isOpen: true,
      title,
      message,
      buttonText,
    });
  };

  const showError = (title: string, message: string, buttonText?: string) => {
    setErrorModal({
      isOpen: true,
      title,
      message,
      buttonText,
    });
  };

  const closeSuccess = () => {
    setSuccessModal((prev) => ({ ...prev, isOpen: false }));
  };

  const closeError = () => {
    setErrorModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    successModal,
    errorModal,
    showSuccess,
    showError,
    closeSuccess,
    closeError,
  };
}
