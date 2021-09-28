import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr'

export const getHtmlWithDecorator = (filePath) =>
    injectDecoratorServerSide({
        dekoratorenUrl: process.env.DECORATOR_URL,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        env: process.env.DECORATOR_ENV as any,
        filePath: filePath,
        chatbot: false,
        feedback: false,
        urlLookupTable: false,
        level: 'Level4',
    })

