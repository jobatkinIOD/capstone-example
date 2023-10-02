const express = require("express");
const app = express();
const cors = require('cors') // first do 'npm install cors'
const path = require('path')

const dotenv = require("dotenv"); // first do 'npm install dotenv'
const environment = process.env.NODE_ENV || "local";

dotenv.config({ path: `./.env.${environment}` }); // support multiple environments, see package.json

require("./dbConnect"); // first run 'npm install sequelize mysql2'

// parse requests of content-type - application / json;
app.use(express.json());
app.use(cors());

let userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes)

app.use("/images", express.static("public/images")); // required for image mappings

// only load the distribution/production version of frontend if we aren't running our local/dev server
if (environment != 'local') {

  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}

// set port, listen for requests
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
