import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { connectDB } from "./config/db.js"
import usersRoutes from "./routes/usersRoutes.js"
import listsRoutes from "./routes/listsRoutes.js"
import itemsRoutes from "./routes/itemsRoutes.js"

// SETUP
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// MIDDLEWARE
app.use(cors({
    origin: process.env.FRONTEND_URL
}))
app.use(express.json()) // ie bodyParser

// ROUTES
app.use("/api/users", usersRoutes)
app.use("/api/lists", listsRoutes)
app.use("/api/items", itemsRoutes)

// ERROR HANDLING
app.use((error, _, res, next) => {
    if (res.headerSet) return next(error); // can only send one response : incase one is already sent
    res.status(error.code || 500);
    res.json({ message: error.message || "unknown error. sorry :(" });
});

// LISTEN
connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        // console.log("Server is running on port", PORT)
    })
})

export default app