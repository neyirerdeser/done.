import express from "express"
import { getListById, getListsByUserId, createList, updateListById, deleteListById } from "../controllers/listsController.js"
import auth from "../middleware/auth.js"

const router = express.Router();

router.use(auth)

router.post("/", createList)
router.patch("/:lid", updateListById)
router.delete("/:lid", deleteListById)
router.get("/user/:uid", getListsByUserId)
router.get("/:lid", getListById)

export default router