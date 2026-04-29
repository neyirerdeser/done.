import mongoose from "mongoose"

import Item from "../src/models/item.js"
import List from "../src/models/list.js"
import { createItem, deleteItemById, getItemById, getItemsByListId, updateItemById } from "../src/controllers/itemsController.js"

const mockListId = "69e6c7e4f89a0dd817cd9e66"
const wrongListId = "69e6c7e4f89a0dd817cd9e65"

const mockItemId = "69e7afd60764548ad02d48bd"
const wrongItemId = "69e7afd60764548ad02d47bd"

const mockUserId = "69e6c7cef89a0dd817cd9e65"
const wrongUserId = "69e78acd5c1b55dbb8928a1d"

const invalidId = "123abc"

const mockList = new List({
    _id: mockListId,
    title: "list",
    items: { pull: jest.fn() }, // make it pull-able
    creator: mockUserId
})

const mockItem = new Item({
    _id: mockItemId,
    title: "item",
    list: mockList,
    details: {
        completed: false
    }
})

List.prototype.save = jest.fn().mockImplementation(() => { })
Item.prototype.save = jest.fn().mockImplementation(() => { })
Item.prototype.deleteOne = jest.fn().mockImplementation(() => { })
Item.prototype.populate = jest.fn().mockImplementation(
    function () {
        this.list = mockList
        return Promise.resolve(this)
    })

const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
const next = jest.fn()
const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
}

describe("ItemsController", () => {
    describe("getItemsById : GET /items/:iid", () => {
        it("given valid item id, should return an item", async () => {
            Item.findById = jest.fn().mockReturnValueOnce(mockItem)
            const req = { params: { iid: mockItemId } }
            await getItemById(req, res)
            expect(res.json).toHaveBeenCalledWith({ item: mockItem })
        })
        it("given invalid item id, should return a 404 error", async () => {
            Item.findById = jest.fn().mockReturnValueOnce(null)
            const req = { params: { iid: wrongItemId } }
            await getItemById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = { params: { iid: invalidId } }
            await getItemById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
    })
    describe("getItemsByListId : GET /items/user/:lid", () => {
        it("given valid listId, should return Array of items for the list", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const req = { params: { lid: mockListId } }
            await getItemsByListId(req, res)
            expect(res.json).toHaveBeenCalledWith({ items: mockList.items })
        })
        it("given invalid listId, should return a 404 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(null)
            const req = { params: { lid: mockListId } }
            await getItemsByListId(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = { params: { lid: invalidId } }
            await getItemsByListId(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
    })
    describe("createItem : POST /items", () => {
        it("given valid content and user, should create a new item and add it to user items", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const updateSpy = jest.spyOn(List.prototype, "updateOne").mockResolvedValue(true)
            jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession)
            const req = {
                body: {
                    title: "title",
                    list: mockListId,
                },
                userData: { userId: mockUserId }
            }
            await createItem(req, res, next)
            expect(mongoose.startSession).toHaveBeenCalled()
            expect(mockSession.startTransaction).toHaveBeenCalled()
            expect(Item.prototype.save).toHaveBeenCalled()
            expect(updateSpy).toHaveBeenCalled()
            expect(mockSession.commitTransaction).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                item: expect.objectContaining({
                    title: "title"
                })
            }))
        })
        it("given invalid list, should return a 404 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(null)
            const req = {
                body: {
                    title: "title",
                    list: wrongListId,
                },
                userData: { userId: mockUserId }
            }
            await createItem(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given wrong user, should return a 401 error", async () => {
            List.findById = jest.fn().mockReturnValueOnce(mockList)
            const req = {
                body: {
                    title: "title",
                    list: mockList,

                },
                userData: { userId: wrongUserId }
            }
            await createItem(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
    })
    describe("updateItemById : PATCH /items/:iid", () => {
        it("given valid content, should update item with given information", async () => {
            const req = {
                body: { completed: true },
                params: { iid: mockItemId },
                userData: { userId: mockUserId }
            }
            Item.findById = jest.fn().mockReturnValue(mockItem)
            await updateItemById(req, res)
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                item: expect.objectContaining({
                    detail: expect.objectContaining({
                        completed: true
                    })
                })
            }))
        })
        it("given invalid item id, should return a 404 error", async () => {
            const req = {
                body: { completed: true },
                params: { iid: mockItemId },
                userData: { userId: wrongUserId }
            }
            Item.findById = jest.fn().mockReturnValue(null)
            await updateItemById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = {
                body: { completed: true },
                params: { iid: invalidId },
                userData: { userId: mockUserId }
            }
            await updateItemById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
        it("given invalid user, should return a 401 error", async () => {
            const req = {
                body: { completed: true },
                params: { iid: mockItemId },
                userData: { userId: wrongUserId }
            }
            Item.findById = jest.fn().mockReturnValue(mockItem)
            await updateItemById(req, res, next)
            expect(Item.findById).toHaveBeenCalled()
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
    })
    describe("deleteItemById: DELETE /items/:iid", () => {
        it("given valid item id and user, should delete the item and remove from list items", async () => {
            const req = {
                params: { iid: mockItemId },
                userData: { userId: mockUserId }
            }
            Item.findById = jest.fn().mockReturnValue(mockItem)
            jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession)
            await deleteItemById(req, res, next)
            expect(mongoose.startSession).toHaveBeenCalled()
            expect(mockSession.startTransaction).toHaveBeenCalled()
            expect(List.prototype.save).toHaveBeenCalled()
            expect(Item.prototype.deleteOne).toHaveBeenCalled()
            expect(mockSession.commitTransaction).toHaveBeenCalled()
            expect(res.json).toHaveBeenCalledWith({ message: "item deleted" })
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = {
                params: { iid: invalidId },
                userData: { userId: mockUserId }
            }
            await deleteItemById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
        it("given invalid item id, should return a 404 error", async () => {
            const req = {
                params: { iid: wrongItemId },
                userData: { userId: mockUserId }
            }
            Item.findById = jest.fn().mockReturnValue(null)
            await deleteItemById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid user, should return a 401 error", async () => {
            const req = {
                params: { iid: mockItemId },
                userData: { userId: wrongUserId }
            }
            Item.findById = jest.fn().mockReturnValue(mockItem)
            await deleteItemById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }))
        })
    })
})