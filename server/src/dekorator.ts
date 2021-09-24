import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr'

export const getHtmlWithDecorator = (filePath) =>
    injectDecoratorServerSide({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        env: process.env.DECORATOR_ENV as any,
        dekoratorenUrl: process.env.DECORATOR_URL,
        filePath: filePath,
        simple: true,
        chatbot: false,
        feedback: false,
        urlLookupTable: false,
        level: 'Level4',
    })

