export default function formatCurrency(currency: number | undefined): string {
    return currency !== undefined
        ? new Intl.NumberFormat('no-NO', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(currency)
        : ''
}
