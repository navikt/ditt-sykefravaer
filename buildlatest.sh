echo "Bygger ditt-sykefravaer latest for docker compose utvikling"

npm i

npm run build
cd server
npm i
npm run build
cd ..
docker build . -t ditt-sykefravaer:latest
