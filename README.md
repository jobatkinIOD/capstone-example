# IOD SE Capstone Example Application
Includes deployment instructions for EC2 - there are many other options as well, but hopefully this will give some guidance. It assumes you have a DB already running in the Cloud, either MySQL on AWS RDS or Mongo on MongoDB Atlas.

To run both backend and frontend on a single port, taking into account both development and production environments, we need to make several changes to support multiple ways of starting the app using different configurations for different purposes.

## Frontend (Vite)
- **vite.config.js**: Add a proxy server to allow internally fetched URLs to be proxied from front to back end. This lets us use relative URLs like `/api/users` instead of hardcoding a localhost port like `http://localhost:8080/api/users`, and should work in both dev and prod environments
- **components**: Change all localhost type URLs to use a relative format that makes use of the proxy

## Backend (Express)
- **concurrently**: Do `npm install concurrently` to install the concurrently package to allow back and front ends to be started together with a single command
- **package.json**: Add custom start scripts. I've added 5 - 
    - `npm run dev`: starts just the backend using local configuration, 
    - `npm run prod`: starts just the backend using AWS or production configuration (assumes frontend is built into dist folder), 
    - `npm run aws`: starts just the backend on Linux type servers using production configuration (assumes frontend is built into dist folder),
    - `npm run start-local`: starts both front and backend concurrently using local configuration, and 
    - `npm run start`: builds the frontend into a static site and starts the backend using AWS or production configuration.
- **server.js**: Change the way the dotenv module loads configuration from a .env file to support both local and aws configuration options. If we're not running in development mode, add support to the Express app for serving the 'built' or 'distribution' versions of the React frontend

# DEVELOPMENT
*Needs separate environment config to use a local database server on localhost: set this config in `.env.local`*
We want to keep both backend and frontend running and restarting when changes are made.
Start the app with `npm run start-local` and access the app in a browser by using the dev React port, usually http://localhost:5173/

# PRODUCTION
*Needs separate environment config to use a cloud-based database server on AWS or Atlas: set this config in `.env.production`*
We need to create a static 'distribution' or 'built' version of the React frontend that doesn't need to run independently, but can just be served from the backend.
Then we can run just the backend on a single port with a single command, and this makes deployment much more simple.
Access the app in a browser by using the backend port defined in .env.production, on whatever server is used for deployment (could be EC2 via Docker, or EC2 via Beanstalk, or something else).

If the Docker build (see below) is causing problems or timing out, it may be simpler to skip it and simply create an EC2 server and run the build commands from there using SSH.
1. Install git and nodejs - `sudo yum install git` and `sudo yum install nodejs`
2. Clone your git repo - `git clone \<url of repository\>`
3. Install the dependencies - `cd backend && npm install` and `cd frontend && npm install && npm run build`
4. Make sure the `.env.production` file is present and contains the right config - you may want to change the PORT to 80
5. Start the backend - `sudo npm run prod` from the `backend` folder

## DOCKER
The Dockerfile instructions (included) are slightly more complex to handle packaging and running both back and frontend apps in the one container (there are many ways of doing this, but this one aims to keep things fairly simple and easy to understand). After defining the build environment (node.js) we copy all of the files from the backend folder (but not the folder itself) into the app working directory, and then the frontend folder with all its contents. Then we switch into the app folder as our working directory, install both back and front end dependencies, expose the internal port, and start the backend.
The front end is packaged into the dist directory and served from the backend, so we don't need to start it separately.

Run `docker build -t \<dockerhubuser\>/\<appname\> .` locally, from the same folder where the Dockerfile is to build the image - *this will take several minutes*. Make sure to replace `\<dockerhubuser\>` with your own DockerHub username, and `\<appname\>` with the name of your app.
You can then run the image locally to test it, and/or do `docker push \<dockerhubuser\>/\<appname\>` to push it to your remote DockerHub account and then `sudo docker pull \<dockerhubuser\>/\<appname\>` from any server to download it.

To run the image via the command line, do `sudo docker run -d -p 80:8080 \<dockerhubuser\>/\<appname\>`, making sure to replace port 80 with whatever port you want to be able to access the app on via the browser, and replace port 8080 with whatever port the backend runs on internally.