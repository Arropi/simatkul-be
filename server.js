import express from "express"
import cors from "cors"
import { PORT } from "./config/env.js"
import { ConnectDB } from "./config/database.js"
import authRouter from "./routes/auth-route.js"
import masterDataRouter from "./routes/master-data/index.js"
import { errorMiddleware } from "./middleware/error-middleware.js"

const app = express()

app.use(express.json())
app.use(cors())

await ConnectDB()

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/auth", authRouter)
app.use("/api/master-data", masterDataRouter)

app.use(errorMiddleware)

app.listen(PORT, async() => {
    console.log(`Listening To http://localhost:${PORT}`)
})