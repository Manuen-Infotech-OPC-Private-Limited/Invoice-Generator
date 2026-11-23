/**
 * Formats a number with Indian comma separation (e.g. 10,00,000.00 or 53,248.73)
 */
export function formatCurrency(amount, showSymbol = false, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '₹0.00' : '0.00';
  }

  const num = Number(amount);
  const parts = num.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  const isNegative = integerPart.startsWith('-');
  if (isNegative) {
    integerPart = integerPart.substring(1);
  }

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const result = (isNegative ? '-' : '') + (showSymbol ? '₹' : '') + formattedInteger + (decimals > 0 ? '.' + decimalPart : '');
  return result;
}

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  // If already in DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
  const [year, month, day] = dateString.split('-');
  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }
  return dateString;
}
