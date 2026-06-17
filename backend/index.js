//imports
const express = require("express");
const cors = require('cors')
const env = require('dotenv').config()
const app = express();
const connection = require('./config/db.js')
const limiter = require('./middlewares/ratelimit')
const authrouter = require('./routes/authroute.js')
const profilerouter = require('./routes/profilerouter.js')
const musicnoterouter = require('./routes/musicnoterouter.js')
const port = 3000;

//middlewares
app.use(express.json())
app.use(cors())
app.use(limiter)

//routes
app.use("/auth",authrouter)
app.use("/profile",profilerouter)
app.use("/music",musicnoterouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connection()
});