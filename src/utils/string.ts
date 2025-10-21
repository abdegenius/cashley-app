export const toDigitArray = (value: string | number) => {
  const str = String(value || "");
  const digits = str.split("").map(Number);
  const filled = [...digits, "*", "*", "*", "*"].slice(0, 4);
  return filled;
};
