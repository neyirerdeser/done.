import mongoose from "mongoose"
import List from "../models/list.js"
import User from "../models/user.js"
import HttpError from "../models/httpError.js"

export const getListById = async (req, res, next) => {
    const id = req.params.lid
    let list
    try {
        list = await List.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list) return next(new HttpError("no such list", 404))
    res.json({ list })
}

export const getListsByUserId = async (req, res, next) => {
    const id = req.params.uid

    let user
    try {
        user = await User.findById(id).populate("lists")
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!user || user.lists.length === 0)
        return next(new HttpError("no lists exist for such user", 404))

    res.json({ lists: user.lists })
}

export const createList = async (req, res, next) => {
    const { title, creator } = req.body
    // TODO
    // const creator = req.userData.userId

    let user
    try {
        user = await User.findById(creator)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!user) return next(new HttpError("no such user", 404))

    const list = new List({ title, items: [], creator })
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
        // user.lists.push(list) // mongoose only adds the id to array
        // await user.save({ session })
        await session.commitTransaction()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.status(201).json({ list })
}

export const updateListById = async (req, res, next) => {
    const id = req.params.lid
    const { title, iconName, user } = req.body
    //  TODO
    // let user = req.userData.userId

    let list
    try {
        list = await List.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list)
        return next(new HttpError("no such list", 404))

    if (list.creator.toString() !== user)
        return next(new HttpError("non-authorized user", 401))

    list.title = title || list.title
    list.iconName = iconName || list.iconName
    try {
        await list.save()
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.json({ list })

}

export const deleteListById = async (req, res, next) => {
    const id = req.params.lid
    const { user } = req.body
    //  TODO
    // let user = req.userData.userId

    let list
    try {
        list = await List.findById(id)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!list)
        return next(new HttpError("no such list", 404))

    if (list.creator.toString() !== user)
        return next(new HttpError("non-authorized user", 401))

    try {
        await List.deleteOne(list)
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.status(200).json({ message: "list deleted" })

}
