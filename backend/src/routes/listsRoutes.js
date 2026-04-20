import express from "express"
import { getListById, getListsByUserId, createList, updateListById, deleteListById } from "../controllers/listsController.js"

const router = express.Router();

router.post("/", createList)
router.patch("/:lid", updateListById)
router.delete("/:lid", deleteListById)
router.get("/:lid", getListById)
router.get("/user/:uid", getListsByUserId)

export default router