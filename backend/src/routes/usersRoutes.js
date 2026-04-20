import express from "express"
import { getUsers, signup, login } from "../controllers/usersController.js"

const router = express.Router()

router.get("/", getUsers)
router.post("/signup", signup)
router.post("/login", login)

export default router