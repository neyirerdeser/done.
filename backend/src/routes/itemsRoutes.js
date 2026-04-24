import express from "express"
import { getItemById, getItemsByListId, createItem, updateItemById, deleteItemById } from "../controllers/itemsController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.use(auth)

router.post("/", createItem)
router.patch("/:iid", updateItemById)
router.delete("/:iid", deleteItemById)
router.get("/list/:lid", getItemsByListId)
router.get("/:iid", getItemById)

export default router