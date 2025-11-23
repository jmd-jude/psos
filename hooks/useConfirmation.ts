// hooks/useConfirmation.ts
'use client';

import { useState } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info';
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    message: '',
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const showConfirmation = (confirmOptions: ConfirmationOptions, onConfirm: () => void) => {
    setOptions(confirmOptions);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    setIsOpen(false);
    setOnConfirmCallback(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setOnConfirmCallback(null);
  };

  return {
    isOpen,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel,
  };
}
