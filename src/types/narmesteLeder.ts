export interface NarmesteLeder {
    id: string
    navn: string
    orgnummer: string
    aktivFom: string
}

export interface Linemanager {
    id: string
    orgNumber: string
    activeFrom: string
    name: {
        firstName: string
        middleName: string | null
        lastName: string
    }
    emailAddresses: string[]
    mobile: string | null
}

export interface LinemanagerResponse {
    linemanagers: Linemanager[]
}

export function tilNarmesteLeder(dto: Linemanager): NarmesteLeder {
    const navn = [dto.name.firstName, dto.name.middleName, dto.name.lastName].filter(Boolean).join(' ')
    return {
        id: dto.id,
        navn,
        orgnummer: dto.orgNumber,
        aktivFom: dto.activeFrom,
    }
}
