import { Page } from '@playwright/test'

export function trackFeedbackMethods(page: Page): string[] {
    const feedbackMethods: string[] = []
    page.on('request', (request) => {
        if (request.url().includes('/flexjar-backend/api/v2/feedback')) {
            feedbackMethods.push(request.method())
        }
    })

    return feedbackMethods
}
