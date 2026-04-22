import express from "express"
import { getUserById, signup, login } from "../controllers/usersController.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/:uid", getUserById)

export default router