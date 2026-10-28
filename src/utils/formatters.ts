/**
 * Formats a decimal quantity into culinary fractional notation (e.g. 1 1/2, 1/4, 2)
 */
export function formatQuantity(amount: number): string {
  if (amount <= 0) return '';

  const whole = Math.floor(amount);
  const remainder = amount - whole;

  // Round remainder to nearest common fraction
  const tolerance = 0.08;
  let fractionStr = '';

  if (Math.abs(remainder - 0.125) < tolerance) fractionStr = '⅛';
  else if (Math.abs(remainder - 0.25) < tolerance) fractionStr = '¼';
  else if (Math.abs(remainder - 0.333) < tolerance) fractionStr = '⅓';
  else if (Math.abs(remainder - 0.375) < tolerance) fractionStr = '⅜';
  else if (Math.abs(remainder - 0.5) < tolerance) fractionStr = '½';
  else if (Math.abs(remainder - 0.625) < tolerance) fractionStr = '⅝';
  else if (Math.abs(remainder - 0.666) < tolerance) fractionStr = '⅔';
  else if (Math.abs(remainder - 0.75) < tolerance) fractionStr = '¾';
  else if (Math.abs(remainder - 0.875) < tolerance) fractionStr = '⅞';
  else if (remainder >= 0.92) {
    return `${whole + 1}`;
  } else if (remainder > 0.05) {
    // If not matching a standard fraction, round to 1 decimal place
    return amount.toFixed(1).replace(/\.0$/, '');
  }

  if (whole > 0 && fractionStr) {
    return `${whole} ${fractionStr}`;
  } else if (whole > 0) {
    return `${whole}`;
  } else if (fractionStr) {
    return fractionStr;
  }

  return amount.toFixed(1).replace(/\.0$/, '');
}

/**
 * Scale quantity by serving ratio
 */
export function scaleQuantity(
  baseQuantity: number,
  baseServings: number,
  targetServings: number
): number {
  if (baseServings <= 0 || targetServings <= 0) return baseQuantity;
  return (baseQuantity / baseServings) * targetServings;
}

/**
 * Format minutes into readable string (e.g. "45 min" or "1 hr 15 min")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMins} min`;
}
