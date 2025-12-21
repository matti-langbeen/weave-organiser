# Code opstarten

Om deze website te kunnen opstarten is een installatie van NodeJS of Docker Desktop/Daemon vereist.

## Via NodeJS

```bash
npm install
```
```bash
npm run dev
```
De console geeft een localhost URL terug om de website te bezoeken.

## Via Docker
```bash
docker build -t weave-organiser .
```
```bash
docker run -p 8080:80 weave-organiser
```
De website kan je bezoeken op localhost:8080

