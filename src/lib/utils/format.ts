/**
 * Formatea un número como moneda colombiana (COP)
 * @param amount Cantidad a formatear
 * @param options Opciones de formateo
 * @returns String formateado como moneda
 */
export const formatCurrency = (
  amount: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    currency?: string;
    locale?: string;
  } = {}
): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    currency = 'COP',
    locale = 'es-CO'
  } = options;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch (error) {
    console.error("🚀 ~ error:", error)
    // Fallback si hay error con Intl
    return `$${amount.toLocaleString('es-CO')}`;
  }
};

/**
 * Formatea un número con separadores de miles
 * @param number Número a formatear
 * @param locale Locale para el formateo
 * @returns String formateado con separadores
 */
export const formatNumber = (
  number: number,
  locale: string = 'es-CO'
): string => {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    console.error("🚀 ~ error:", error)
    return number.toLocaleString();
  }
};

/**
 * Formatea un porcentaje
 * @param value Valor decimal (0.15 = 15%)
 * @param decimals Número de decimales
 * @returns String formateado como porcentaje
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error("🚀 ~ error:", error)
    return `${(value * 100).toFixed(decimals)}%`;
  }
};

/**
 * Formatea una fecha
 * @param date Fecha a formatear
 * @param options Opciones de formateo
 * @returns String formateado como fecha
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-CO', defaultOptions).format(dateObj);
  } catch (error) {
    console.error("🚀 ~ error:", error)
    return 'Fecha inválida';
  }
};

/**
 * Formatea un número como cantidad/unidades
 * @param quantity Cantidad
 * @param unit Unidad (opcional)
 * @returns String formateado
 */
export const formatQuantity = (
  quantity: number,
  unit?: string
): string => {
  const formattedNumber = formatNumber(quantity);
  return unit ? `${formattedNumber} ${unit}` : formattedNumber;
};
