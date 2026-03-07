export const isSeasonalRegulationActive = (): boolean => {
    const currentMonth = new Date().getMonth();
    // Month is 0-indexed: 0 = January, 10 = November, 11 = December
    return currentMonth === 10 || currentMonth === 11;
};
