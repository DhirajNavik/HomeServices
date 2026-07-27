import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config({ path: "./config.env" })

process.on('uncaughtException', (err) => {
    //Exception error are syncronos
    console.log(err.message, err.name)
  
})

import app from "./app.js"

mongoose.connect(process.env.CONN_STR).then(conn => {
    console.log("Database Created")
}).catch(err => console.log(`error : ${err}`))

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log("Server started")
})

process.on('unhandledRejection', (err) => {
    console.log(err.message, err.name)
    server.close(() => {
        process.exit(1)
    })
})

