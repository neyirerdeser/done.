import express from "express"
import { getItemById, getItemsByListId, createItem, updateItemById, deleteItemById } from "../controllers/itemsController.js"

const router = express.Router()

router.post("/", createItem)
router.patch("/iid", updateItemById)
router.delete("/iid", deleteItemById)
router.get("/:iid", getItemById)
router.get("/list/:lid", getItemsByListId)

export default router