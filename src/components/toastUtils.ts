import { addToast } from "@heroui/react";

/**
 * Shows a success toast notification
 * @param title The title of the toast
 * @param description The description of the toast (optional)
 */
export const showSuccessToast = (title: string, description?: string) => {
  addToast({
    title,
    description: description || '',
    color: 'success',
    timeout: 3000
  });
};

/**
 * Shows a warning toast notification
 * @param title The title of the toast
 * @param description The description of the toast (optional)
 */
export const showWarningToast = (title: string, description?: string) => {
  addToast({
    title,
    description: description || '',
    color: 'warning',
    timeout: 3000
  });
};

/**
 * Shows a danger toast notification
 * @param title The title of the toast
 * @param description The description of the toast (optional)
 */
export const showDangerToast = (title: string, description?: string) => {
  addToast({
    title,
    description: description || '',
    color: 'danger',
    timeout: 3000
  });
};
