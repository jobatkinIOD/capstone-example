FROM node:19-alpine

# copy backend files without the backend parent folder, then copy frontend folder
COPY backend /app
COPY frontend /app/frontend

# run all subsequent commands relative to the app folder
WORKDIR /app

# install dependencies and build prod version of frontend. --no-audit is faster to avoid timeouts
RUN npm install --no-audit
RUN cd frontend && npm install --no-audit && npm run build
RUN rm -rf frontend/node_modules

# set the production environment
ENV NODE_ENV production

# expose the port from .env.production and start the backend 
EXPOSE 8000
CMD ["npm","run","prod"]