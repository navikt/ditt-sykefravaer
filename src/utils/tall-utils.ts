export const formatterTall = (tall?: number, desimaler = 0): string => {
    if (tall === 0) {
        return '0'
    } else if (tall) {
        const nf_des = new Intl.NumberFormat('nb-NO', {
            maximumFractionDigits: desimaler,
            minimumFractionDigits: desimaler,
            useGrouping: true,
        })
        return nf_des.format(tall)
    } else {
        return ''
    }
}
