export default function formatCurrency(currency: string | undefined): string {
    return currency !== undefined
        ? new Intl.NumberFormat('no-NO', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(
              Number(currency),
          )
        : ''
}
