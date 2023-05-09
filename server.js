const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL=process.env.MONGO_URL;

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use(cors())


// ROUTES
app.use("/conversations",require("./routes/Conversations.js"))
app.use("/auth",require("./routes/auth.js"))
app.use("/messages",require("./routes/messages.js"))
app.get("/",(req,res) => {
    res.status(200).json({ message: "home" })
})

app.post("/",(req,res) => {
    res.send(req.body)
})

 mongoose.connect(MONGO_URL).then(() => console.log('mongoDB connection successful..'))


// LISTENERS
app.listen(PORT,() => console.log(`app running at http://localhost:${PORT}`))