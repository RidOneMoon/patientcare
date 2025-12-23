export const calculateTotalCost = (duration, serviceCharge) => {
  if (!duration || !serviceCharge) return 0;
  return duration * serviceCharge;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(amount);
};