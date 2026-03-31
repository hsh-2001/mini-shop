export const convertAmount = (amount: number, toCurency?: string) => {
    const appStore = useAppStore();
    const { exchangeUSD, exchangeKHR, currencyBase } = appStore.currentCurrency;
    if (!toCurency) {
        toCurency = currencyBase;
    }
    if (toCurency === 'USD') {
        if (currencyBase === 'USD') {
            return amount;
        } else {
            return amount / exchangeUSD;
        }
    } else if (toCurency === 'KHR') {
        if (currencyBase === 'KHR') {
            return amount;
        } else {
            return amount * exchangeKHR;
        }
    }
    return amount;
}

export const formatCurrency = (amount: number, currency?: string) => {
    if (!currency) {
        const appStore = useAppStore();
        currency = appStore.currentCurrency.currencyBase;
    }
    const convertedAmount = convertAmount(amount, currency);

    if (currency === 'KHR') {
        return `${convertedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ៛`;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(convertedAmount);
}