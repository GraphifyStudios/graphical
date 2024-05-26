export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const round = (num: number, precision: number = 0) =>
  parseFloat(num.toFixed(precision));
