const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const Pusher = require("pusher")

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
// app.use((req,res,next) => {
//     res.setHeader("Access-Control-Allow-Origin","*")
// })


// ROUTES
app.use("/conversations", require("./routes/Conversations.js"))
app.use("/auth", require("./routes/auth.js"))
app.use("/messages", require("./routes/messages.js"))
app.use("/posts", require("./routes/posts.js"))
app.get("/", (req, res) => {
    res.status(200).json({ message: "home" })
})

const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "ap2",
    useTLS: true
});

mongoose.connect(MONGO_URL).then(() => console.log('mongoDB connection successful..'))

const db = mongoose.connection

db.once("open", () => {
    const msgCollection = db.collection("conversations")
    const changeStream = msgCollection.watch()

    changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
            const msgDetails = change.fullDocument

            pusher.trigger("messages", "insert", {
                message:"inserted"
            });
        }
        else if (change.operationType === "update") {
            const msgDetails = change.documentKey

              pusher.trigger("messages", "update", {
                message:msgDetails._id
              });
        }
    })
})


// LISTENERS
const server = app.listen(PORT, () => console.log(`app running at http://localhost:${PORT}`))


