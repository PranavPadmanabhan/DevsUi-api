const express = require('express');
const cors = require("cors")
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 5000;

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


// LISTENERS
app.listen(PORT,() => console.log(`app running at http://localhost:${PORT}`))