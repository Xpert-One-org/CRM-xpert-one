/**
 * Calculates the projected revenue (CA) of a mission.
 * @param {number} estimatedDays - Estimated number of days.
 * @param {number} dailyRate - Daily rate (TJM) sold.
 * @param {number} includedCharges - Charges included in the projected revenue.
 * @returns {number} Projected revenue of the mission.
 */
export const calculateProjectedRevenue = (
  estimatedDays: number = 22,
  dailyRate: number,
  includedCharges: number
): number => {
  return estimatedDays * dailyRate + includedCharges;
};

/**
 * Calculates the final revenue of a mission.
 * @param {number} days - Number of days.
 * @param {number} dailyRate - Daily rate (TJM) sold.
 * @param {number} includedCharges - Charges included in the final revenue.
 * @returns {number} Final revenue of the mission.
 */
export const calculateFinalRevenue = (
  days: number,
  dailyRate: number,
  includedCharges: number
): number => {
  return days * dailyRate + includedCharges;
};
