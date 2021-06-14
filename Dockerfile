FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /build /usr/share/nginx/html/syk/sykefravaer
COPY demoside.html /usr/share/nginx/html/index.html


# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html/syk/sykefravaer
COPY ./env.sh .
COPY ./process-index-html.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh
RUN chmod +x process-index-html.sh

EXPOSE 8080


CMD ["/bin/bash", "-c", "/usr/share/nginx/html/syk/sykefravaer/env.sh && /usr/share/nginx/html/syk/sykefravaer/process-index-html.sh && nginx -g \"daemon off;\""]
