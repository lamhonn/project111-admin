/**
 * Format a number to European/Finnish format with comma as decimal separator
 * @param value The number to format
 * @param decimals Number of decimals (default: 2)
 * @returns Formatted string in European format, e.g., "12,34"
 */
export const formatEuroPrice = (value: number, decimals: number = 2): string => {
  const formatted = value.toFixed(decimals);
  return formatted.replace('.', ',');
};

/**
 * Format price with Euro symbol in European style
 * @param value The number to format
 * @param decimals Number of decimals (default: 2)
 * @returns Formatted string with Euro symbol, e.g., "12,34€"
 */
export const formatPriceWithEuro = (value: number, decimals: number = 2): string => {
  return `${formatEuroPrice(value, decimals)}€`;
};
