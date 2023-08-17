import { jsonDeepCopy } from '../../../utils/jsonDeepCopy'

import { sendtSoknad } from './soknader'
import { sykeforloepTestPerson } from './sykeforloepTestPersoner'
import { nySykmelding } from './sykmeldinger'

export const clsPerson = () => {
    const person = jsonDeepCopy(sykeforloepTestPerson())
    person.soknader = [sendtSoknad]
    person.sykmeldinger.push(nySykmelding)

    return person
}
