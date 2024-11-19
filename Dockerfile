FROM node:20-slim

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Set proper NODE_ENV
ENV NODE_ENV=production \
    PORT=3000 \
    NODE_OPTIONS='-r next-logger'

# Copy only the built artifacts and necessary files
COPY --chown=nextjs:nodejs next.config.js ./
COPY --chown=nextjs:nodejs next-logger.config.js ./
COPY --chown=nextjs:nodejs .next ./.next
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs node_modules ./node_modules

# Switch to non-root user
USER nextjs

CMD ["./node_modules/next/dist/bin/next", "start"]
