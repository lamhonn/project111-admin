export const parsePriceValue = (rawValue: string): number => {
  if (!rawValue.trim()) {
    return 0;
  }

  const normalized = rawValue.replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};