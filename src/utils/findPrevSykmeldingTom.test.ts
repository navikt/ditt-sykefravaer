import { describe, expect, it } from 'vitest'

import { Periodetype, RegelStatus, StatusEvent } from '../types/sykmelding/sykmelding'

import { toDate } from './dateUtils'
import { createSykmelding, createSykmeldingPeriode } from './test/dataUtils'
import { findPrevSykmeldingTom } from './findPrevSykmeldingTom'

describe('findPrevSykmeldingTom', () => {
    it('should find previous sykmelding tom closest and before given sykmelding tom', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-08-06',
                        tom: '2022-08-18',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-2',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-10-10',
                        tom: '2022-10-29',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-3',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2023-02-11',
                        tom: '2023-02-25',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-4',
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2023-02-02',
                        tom: '2023-02-10',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[3], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toEqual(toDate('2022-10-29'))
    })

    it('should not find previous sykmelding tom if the same day as given sykmelding tom', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-10-06',
                        tom: '2022-10-18',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-2',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-10-06',
                        tom: '2022-10-18',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[1], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toEqual(null)
    })

    it('should only look back to non-INVALID "BEKREFTET" sykmeldinger', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.BEKREFTET,
                },
                behandlingsutfall: {
                    status: RegelStatus.INVALID,
                    ruleHits: [],
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-08-06',
                        tom: '2022-08-18',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-2',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-10-06',
                        tom: '2022-10-18',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[1], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toBeNull()
    })

    it('should look back to "OK" "BEKREFTET" sykmeldinger', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.BEKREFTET,
                },
                behandlingsutfall: {
                    status: RegelStatus.OK,
                    ruleHits: [],
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-08-06',
                        tom: '2022-08-18',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-2',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-10-06',
                        tom: '2022-10-18',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[1], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toEqual(toDate('2022-08-18'))
    })

    it('should return null if there is no previous sykmelding', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2023-01-02',
                        tom: '2023-01-03',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[0], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toEqual(null)
    })

    it('should return null if other sykmelding tom is after given sykmelding tom', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2023-01-10',
                        tom: '2023-01-15',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-2',
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2023-01-16',
                        tom: '2023-01-20',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[0], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toEqual(null)
    })

    it('should ignore sykmelding inside given sykmelding', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-09-10',
                        tom: '2022-09-15',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-2',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-09-12',
                        tom: '2022-09-12',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[0], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toEqual(null)
    })

    it('should handle other sykmeldinger with inverse fom/tom when avvist', async () => {
        const sykmeldinger = [
            createSykmelding({
                id: 'id-1',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-09-10',
                        tom: '2022-09-15',
                    }),
                ],
            }),
            createSykmelding({
                id: 'id-2',
                sykmeldingStatus: {
                    ...createSykmelding().sykmeldingStatus,
                    statusEvent: StatusEvent.BEKREFTET,
                },
                behandlingsutfall: {
                    status: RegelStatus.INVALID,
                    ruleHits: [],
                },
                sykmeldingsperioder: [
                    createSykmeldingPeriode({
                        fom: '2022-09-12',
                        tom: '2022-09-01',
                    }),
                ],
            }),
        ]

        const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[0], 'default-arbeidsgiver', sykmeldinger)

        expect(previousSykmeldingTom).toEqual(null)
    })

    describe('only check sykmeldinger with status SENDT or BEKREFTET', () => {
        it('should return the closest tom for sykmelding with status SENDT', async () => {
            const sykmeldinger = [
                createSykmelding({
                    id: 'id-1',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.AVBRUTT,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-02-11',
                            tom: '2023-02-25',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-2',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.SENDT,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-01-10',
                            tom: '2023-01-29',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-3',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.APEN,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-02-11',
                            tom: '2023-02-21',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-4',
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-04-02',
                            tom: '2023-04-10',
                        }),
                    ],
                }),
            ]

            const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[3], 'default-arbeidsgiver', sykmeldinger)

            expect(previousSykmeldingTom).toEqual(toDate('2023-01-29'))
        })

        it('should return the closest tom for sykmelding with status BEKREFTET', async () => {
            const sykmeldinger = [
                createSykmelding({
                    id: 'id-1',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.SENDT,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2022-12-15',
                            tom: '2022-12-31',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-2',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.BEKREFTET,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-01-10',
                            tom: '2023-01-29',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-3',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.UTGATT,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-03-02',
                            tom: '2023-03-10',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-4',
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-03-18',
                            tom: '2023-03-25',
                        }),
                    ],
                }),
            ]

            const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[3], 'default-arbeidsgiver', sykmeldinger)

            expect(previousSykmeldingTom).toEqual(toDate('2023-01-29'))
        })

        it('should only return closest tom for sykmelding with same arbeidsgiver', async () => {
            const sykmeldinger = [
                createSykmelding({
                    id: 'id-1',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.SENDT,
                        arbeidsgiver: {
                            orgNavn: 'Arby Giver',
                            orgnummer: 'arbeidsgiver-a',
                        },
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2022-12-15',
                            tom: '2022-12-31',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-2',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.BEKREFTET,
                        arbeidsgiver: {
                            orgNavn: 'Arby Taker',
                            orgnummer: 'arbeidsgiver-b',
                        },
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-01-10',
                            tom: '2023-01-29',
                        }),
                    ],
                }),
            ]

            const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[1], 'default-arbeidsgiver', sykmeldinger)

            expect(previousSykmeldingTom).toEqual(null)
        })
    })

    describe('AVVENTENDE period type', () => {
        it('should ignor sykmelding with period type AVVENTENDE', async () => {
            const sykmeldinger = [
                createSykmelding({
                    id: 'id-1',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.BEKREFTET,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-01-11',
                            tom: '2023-01-25',
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-2',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.SENDT,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-02-10',
                            tom: '2023-02-29',
                            type: Periodetype.AVVENTENDE,
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-3',
                    sykmeldingStatus: {
                        ...createSykmelding().sykmeldingStatus,
                        statusEvent: StatusEvent.SENDT,
                    },
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-03-11',
                            tom: '2023-03-21',
                            type: Periodetype.AVVENTENDE,
                        }),
                    ],
                }),
                createSykmelding({
                    id: 'id-4',
                    sykmeldingsperioder: [
                        createSykmeldingPeriode({
                            fom: '2023-04-02',
                            tom: '2023-04-10',
                        }),
                    ],
                }),
            ]

            const previousSykmeldingTom = findPrevSykmeldingTom(sykmeldinger[3], 'default-arbeidsgiver', sykmeldinger)

            expect(previousSykmeldingTom).toEqual(toDate('2023-01-25'))
        })
    })
})
