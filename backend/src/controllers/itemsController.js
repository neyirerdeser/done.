import mongoose from "mongoose";
import Item from "../models/item.js";
import List from "../models/list.js";
import HttpError from "../models/httpError.js"

export const createItem = async (req, res, next) => {
    const { title, list, dueDate } = req.body

    let parentList
    try {
        parentList = await List.findById(list)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!parentList)
        return next(new HttpError("no such list", 404))

    let item = new Item({ title, list })
    item.populate("list")
    if (dueDate) item.detail.dueDate = dueDate

    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await item.save({ session })
        item.list = await List.updateOne(
            item.list,
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
    const { title, dueDate, completed } = req.body
    const id = req.params.iid
    //  TODO
    // let user = req.userData.userId

    let item
    try {
        item = await Item.findById(id).populate("list")
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!item)
        return next(new HttpError("no such item", 404))
    // if (item.list.creator.toString() !== user)
    //     return next(new HttpError("non-authorized user", 401))

    item.title = title || item.title
    item.dueDate = dueDate || item.dueDate
    item.detail.completed = completed || item.detail.completed
    try {
        await item.save()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    res.json({ item })
}

export const deleteItemById = async (req, res, next) => {
    const id = req.params.iid
    let item
    try {
        item = await Item.findById(id).populate("list")
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!item)
        return next(new HttpError("no such item", 404))
    // if (item.list.creator.toString() !== user)
    //     return next(new HttpError("non-authorized user", 401))

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
    let list
    try {
        list = await List.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list || list.items.length === 0)
        return next(new HttpError("no items exist for such list", 404))

    res.json({ items: list.items })
}