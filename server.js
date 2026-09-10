import express from "express"
import cors from "cors"
import { PORT } from "./config/env.js"
import { ConnectDB } from "./config/database.js"
const app = express()

app.use(express.json())
app.use(cors())

await ConnectDB()

app.get("/", (req, res)=> {
    res.send("Hello World")
})

app.listen(PORT, async() => {
    console.log(`Listening To http://localhost:${PORT}`)
})