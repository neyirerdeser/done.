import request from "supertest"
import mongoose from "mongoose"

import List from "../src/models/list.js"
import User from "../src/models/user.js"
import { createList, deleteListById, getListById, getListsByUserId, updateListById } from "../src/controllers/listsController.js"

const mockUserId = "69e6c7cef89a0dd817cd9e65"
const wrongUserId = "69e6c7e4f89a0dd817cd9e66"

const mockListId = "69e6c7e4f89a0dd817cd9e66"
const wrongListId = "69e6c7cef89a0dd817cd9e65"

const invalidId = "123abc"

const mockList = new List({
    _id: mockListId,
    title: "list",
    items: [],
    creator: mockUserId,
    iconName: "List"
})
const mockUser = new User({
    _id: mockUserId,
    lists: { pull: jest.fn() }
})

List.prototype.save = jest.fn().mockImplementation(() => { })
List.prototype.deleteOne = jest.fn().mockImplementation(() => { })
List.prototype.populate = jest.fn().mockImplementation(
    function () {
        this.creator = mockUser
        return Promise.resolve(this)
    }
)
User.prototype.save = jest.fn().mockImplementation(() => { })
User.prototype.populate = jest.fn().mockImplementation(
    function () {
        this.lists = mockUser
        return Promise.resolve(this)
    }
)

const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
const next = jest.fn()
const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
}

describe("ListsController", () => {
    describe("getListById : GET /lists/:lid", () => {
        it("given valid list id should return a list", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const req = {
                params: { lid: mockListId },
                userData: { userId: mockUserId }
            }
            await getListById(req, res)
            expect(res.json).toHaveBeenCalledWith({ list: mockList })
        })
        it("given invalid list id, should return a 404 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(null)
            const req = {
                params: { lid: wrongListId },
                userData: { userId: mockUserId }
            }
            await getListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = {
                params: { lid: invalidId },
                userData: { userId: mockUserId }
            }
            await getListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
        it("given invalid user, should return a 401 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const req = {
                params: { lid: mockListId },
                userData: { userId: wrongUserId }
            }
            await getListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
    })
    describe("getListsByUserId : GET /lists/user/:uid", () => {
        it("given valid userId, should return Array of lists for the user", async () => {
            User.findById = jest.fn().mockReturnValueOnce(mockUser)
            const req = {
                params: { uid: mockUserId },
                userData: { userId: mockUserId }
            }
            await getListsByUserId(req, res)
            expect(res.json).toHaveBeenCalledWith({ lists: mockUser.lists })
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = {
                params: { uid: invalidId },
                userData: { userId: mockUserId }
            }
            await getListsByUserId(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
        it("given wrong userId, should return a 401 error", async () => {
            const req = {
                params: { uid: mockUserId },
                userData: { userId: wrongUserId }
            }
            await getListsByUserId(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
        it("given invalid userId, should return a 404 error", async () => {
            User.findById = jest.fn().mockReturnValueOnce(null)
            const req = {
                params: { uid: wrongUserId },
                userData: { userId: wrongUserId }
            }
            await getListsByUserId(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
    })
    describe("createList : POST /lists", () => {
        it("given valid content and user, should create a new list and add it to user lists", async () => {
            User.findById = jest.fn().mockReturnValueOnce(mockUser)
            jest.spyOn(User, "findOneAndUpdate").mockResolvedValue(true)
            jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession)
            const req = {
                body: {
                    title: "title",
                    creator: mockUserId
                },
                userData: { userId: mockUserId }
            }
            await createList(req, res)
            expect(mockSession.commitTransaction).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                list: expect.objectContaining({
                    title: "title"
                })
            }))
        })
        it("given invalid user, should return a 404 error", async () => {
            User.findById = jest.fn().mockReturnValueOnce(null)
            const req = {
                body: {
                    title: "title",
                    creator: wrongUserId
                },
                userData: { userId: mockUserId }
            }
            await createList(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given wrong user, should return a 401 error", async () => {
            User.findById = jest.fn().mockReturnValueOnce(mockUser)
            const req = {
                body: {
                    title: "title",
                    creator: mockUserId
                },
                userData: { userId: wrongUserId }
            }
            await createList(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
    })

    describe("updateListById : PATCH /lists/:lid", () => {
        it("given valid content, should update list with given information", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const req = {
                params: { lid: mockListId },
                body: { title: "new title" },
                userData: { userId: mockUserId }
            }
            await updateListById(req, res, next)
            expect(List.findById).toHaveBeenCalled()
            expect(List.prototype.save).toHaveBeenCalled()
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                list: expect.objectContaining({
                    title: "new title"
                })
            }))
        })
        it("given invalid list id, should return a 404 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(null)
            const req = {
                params: { lid: wrongListId },
                body: { title: "new title" },
                userData: { useId: mockUserId }
            }
            await updateListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = {
                params: { lid: invalidId },
                body: { title: "new title" },
                userData: { useId: mockUserId }
            }
            await updateListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
        it("given invalid user, should return a 401 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const req = {
                params: { lid: mockListId },
                body: { title: "new title" },
                userData: { useId: wrongUserId }
            }
            await updateListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
    })
    describe("deleteListById : DELETE /lists/:lid", () => {
        it("given valid list id and user, should delete the list and remove from user lists", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession)
            const req = {
                params: { lid: mockListId },
                userData: { userId: mockUserId }
            }
            await deleteListById(req, res)
            expect(res.json).toHaveBeenCalledWith({ message: "list deleted" })
        })
        it("given invalid list id, should return a 404 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(null)
            const req = {
                params: { lid: wrongListId },
                userData: { userId: mockUserId }
            }
            await deleteListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = {
                params: { lid: invalidId },
                userData: { userId: mockUserId }
            }
            await deleteListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
        it("given invalid user, should return a 401 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const req = {
                params: { lid: mockListId },
                userData: { userId: wrongUserId }
            }
            await deleteListById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
    })
})