import express from "express"
import cors from "cors"
import { PORT } from "./config/env.js"
import { ConnectDB } from "./config/database.js"
import authRouter from "./routes/auth-route.js"
import masterDataRouter from "./routes/master-data/index.js"
import penjadwalanRouter from "./routes/penjadwalan/penjadwalan-route.js"
import swaggerRouter from "./routes/swagger-route.js"
import { errorMiddleware } from "./middleware/error-middleware.js"

const app = express()

// Normalisasi multiple slashes pada path (misal //11 menjadi /11)
app.use((req, res, next) => {
  const qIndex = req.url.indexOf("?");
  if (qIndex !== -1) {
    const pathname = req.url.slice(0, qIndex).replace(/\/{2,}/g, "/");
    const search = req.url.slice(qIndex);
    req.url = pathname + search;
  } else if (req.url.includes("//")) {
    req.url = req.url.replace(/\/{2,}/g, "/");
  }
  next();
});

app.use(express.json())
app.use(cors())

await ConnectDB()

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/auth", authRouter)
app.use("/api/master-data", masterDataRouter)
app.use("/api/penjadwalan", penjadwalanRouter)
app.use("/api-docs", swaggerRouter)

app.use(errorMiddleware)

app.listen(PORT, async() => {
    console.log(`Listening To http://localhost:${PORT}`)
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`)
})

export default app;