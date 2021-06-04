echo "Bygger ditt-sykefravaer latest for docker compose utvikling"

npm i

npm run build
docker build . -f Dockerfile -t ditt-sykefravaer:latest
