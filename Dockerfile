FROM node:8.9.1 as build-env
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
COPY ./skill.ts ./skill.ts
COPY ./tsconfig.json ./
RUN yarn build

FROM gcr.io/distroless/nodejs:debug
COPY --from=build-env /app /app
WORKDIR /app
CMD ["skill.js"]
EXPOSE 3000
EXPOSE 13000
ENTRYPOINT [ "/nodejs/bin/node", "skill.js" ]