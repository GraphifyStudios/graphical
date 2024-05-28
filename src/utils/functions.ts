export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const round = (num: number, precision: number = 0) =>
  parseFloat(num.toFixed(precision));

export function unabbreviate(str: string, balance: number): number {
  const abbreviations = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
  };
  str = str.toLowerCase();

  if (str === "all" || str === "max") return balance;

  for (const [abbr, value] of Object.entries(abbreviations)) {
    if (str.endsWith(abbr)) {
      return parseInt(str.replace(abbr, "")) * value;
    }
  }

  return parseInt(str);
}
