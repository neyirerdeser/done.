import mongoose from "mongoose"
import List from "../models/list.js"
import User from "../models/user.js"
import HttpError from "../models/httpError.js"

export const getListById = async (req, res, next) => {
    let user = req.userData.userId
    const id = req.params.lid
    let list
    try {
        list = await List.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list) return next(new HttpError("no such list", 404))
    if (list.creator.toString() != user) return next(new HttpError("non-authorized user", 401))
    
    res.json({ list })
}

export const getListsByUserId = async (req, res, next) => {
    const userId = req.userData.userId
    const id = req.params.uid
    if(userId != id) return next(new HttpError("non-authorized user", 401))
    let user
    try {
        user = await User.findById(id).populate("lists")
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!user)
        return next(new HttpError("no lists exist for such user", 404))

    res.json({ lists: user.lists })
}

export const createList = async (req, res, next) => {
    const { title, creator } = req.body
    const userId = req.userData.userId

    let user
    try {
        user = await User.findById(creator)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!user) return next(new HttpError("no such user", 404))
    if (user.id != userId) return next(new HttpError("non-authorized user", 401))

    let list = new List({ title, items: [], creator })
    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await list.save({ session })
        user = await User.findOneAndUpdate(
            user,
            {
                $push: {
                    lists: {
                        $each: [list],
                        $position: 0
                    }
                }
            },
            { session, returnDocument: 'after' }
        )
        await session.commitTransaction()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.status(201).json({ list })
}

export const updateListById = async (req, res, next) => {
    const id = req.params.lid
    const { title, iconName } = req.body
    let userId = req.userData.userId

    let list
    try {
        list = await List.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list)
        return next(new HttpError("no such list", 404))

    if (list.creator.toString() !== userId)
        return next(new HttpError("non-authorized user", 401))

    list.title = title || list.title
    list.iconName = iconName || list.iconName
    try {
        list = await list.save()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.json({ list })

}

export const deleteListById = async (req, res, next) => {
    const id = req.params.lid
    let userId = req.userData.userId

    let list
    try {
        list = await List.findById(id).populate("creator")
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list)
        return next(new HttpError("no such list", 404))

    if (list.creator.id.toString() !== userId)
        return next(new HttpError("non-authorized user", 401))

    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        list.creator.lists.pull(list)
        await list.creator.save({ session })
        await list.deleteOne({ session })
        await session.commitTransaction()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.json({ message: "list deleted" })
}