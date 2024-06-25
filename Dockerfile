FROM node:18-alpine

WORKDIR /src

COPY . .

RUN npm install

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]