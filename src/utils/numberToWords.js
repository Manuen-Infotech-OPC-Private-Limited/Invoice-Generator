const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n) {
  let str = '';
  if (n >= 100) {
    str += ones[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)];
    if (n % 10 > 0) {
      str += '-' + ones[n % 10];
    }
    str += ' ';
  } else if (n > 0) {
    str += ones[n] + ' ';
  }
  return str.trim();
}

/**
 * Converts a number to Indian Currency Words
 * Example: 62833.51 -> Indian Rupee Sixty-Two Thousand Eight Hundred Thirty-Three and Fifty-One Paise Only
 */
export function numberToIndianCurrencyWords(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Indian Rupee Zero Only';
  }

  const num = Math.abs(Number(amount));
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) {
    return 'Indian Rupee Zero Only';
  }

  let words = '';

  const crore = Math.floor(integerPart / 10000000);
  let remainder = integerPart % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const hundred = remainder;

  if (crore > 0) {
    words += convertBelowThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertBelowThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertBelowThousand(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    words += convertBelowThousand(hundred) + ' ';
  }

  words = words.trim();
  if (!words) {
    words = 'Zero';
  }

  let result = `Indian Rupee ${words}`;

  if (decimalPart > 0) {
    const paiseWords = convertBelowThousand(decimalPart);
    result += ` and ${paiseWords} Paise`;
  }

  result += ' Only';
  return result;
}
