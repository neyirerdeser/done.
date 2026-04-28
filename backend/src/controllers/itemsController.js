import mongoose, { isValidObjectId } from "mongoose";
import Item from "../models/item.js";
import List from "../models/list.js";
import HttpError from "../models/httpError.js"

export const createItem = async (req, res, next) => {
    const { title, list } = req.body
    const userId = req.userData.userId

    let listObj
    try {
        listObj = await List.findById(list)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    if (!listObj) return next(new HttpError("no such list", 404))
    if (listObj.creator.toString() != userId) return next(new HttpError("non-authorized user", 401))

    let item = new Item({ title, list })
    await item.populate("list")

    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await item.save({ session })
        await item.list.updateOne(
            {
                $push: {
                    items: {
                        $each: [item],
                        $position: 0
                    }
                }
            },
            { session }
        )
        await session.commitTransaction()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.status(201).json({ item })
}

export const updateItemById = async (req, res, next) => {
    const { title, dueDate, completed, note } = req.body
    const id = req.params.iid
    let user = req.userData.userId

    if (!isValidObjectId(id)) return next(new HttpError("invalid id", 400))
    let item
    try {
        item = await Item.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!item) return next(new HttpError("no such item", 404))
    await item.populate("list")
    if (item.list.creator.toString() != user)
        return next(new HttpError("non-authorized user", 401))

    item.title = title || item.title
    item.detail.dueDate = dueDate || item.detail.dueDate
    item.detail.note = note || item.detail.note
    if (typeof (completed) === 'boolean')
        item.detail.completed = completed
    try {
        await item.save()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    res.json({ item })
}

export const deleteItemById = async (req, res, next) => {
    const id = req.params.iid
    let user = req.userData.userId

    if (!isValidObjectId(id)) return next(new HttpError("invalid id", 400))
    let item
    try {
        item = await Item.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!item) return next(new HttpError("no such item", 404))
    await item.populate("list")
    if (item.list.creator.toString() != user)
        return next(new HttpError("non-authorized user", 401))

    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        item.list.items.pull(item)
        await item.list.save({ session })
        await item.deleteOne({ session })
        await session.commitTransaction()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.json({ message: "item deleted" })
}

export const getItemById = async (req, res, next) => {
    const id = req.params.iid

    if (!isValidObjectId(id)) return next(new HttpError("invalid id", 400))
    let item
    try {
        item = await Item.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!item) return next(new HttpError("no such item", 404))
    res.json({ item })
}

export const getItemsByListId = async (req, res, next) => {
    const id = req.params.lid

    if (!isValidObjectId(id)) return next(new HttpError("invalid id", 400))
    let list
    try {
        list = await List.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list)
        return next(new HttpError("no such list", 404))

    res.json({ items: list.items })
}