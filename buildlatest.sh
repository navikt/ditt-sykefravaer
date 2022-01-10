echo "Bygger ditt-sykefravaer latest for docker compose utvikling"

npm i

npm run build


docker build . -t ditt-sykefravaer:latest
