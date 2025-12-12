export const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatCurrencyRange = (min: number, max: number): string => {
    return `₹${min.toLocaleString('en-IN')}–₹${max.toLocaleString('en-IN')}`;
};
