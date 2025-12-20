import { LabTest } from "../types";

export const labService = {
    /**
     * Calculates the effective price of a lab test.
     * If the main test price is 0, it sums up the prices of all its template items.
     */
    calculateEffectivePrice: (test: LabTest): number => {
        if (test.price > 0) return test.price;
        return test.template.reduce((sum, item) => sum + (item.price || 0), 0);
    }
};
