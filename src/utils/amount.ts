export const formatToNGN = (amount: number = 0, decimal: boolean = true) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: !decimal ? 0 : 2,
  }).format(amount);
};

export const formatToNGNCompact = (amount: number = 0, decimal: boolean = true) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: !decimal ? 0 : 1,
  }).format(amount);
};

export const formatToUSD = (amount: number = 0, decimal: boolean = true) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: !decimal ? 0 : 2,
  }).format(amount);
};

export const formatToUSDCompact = (amount: number = 0, decimal: boolean = true) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: !decimal ? 0 : 1,
  }).format(amount);
};
