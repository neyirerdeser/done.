import request from "supertest"
import app from "../src/server.js"

const listId = "69e6c7e4f89a0dd817cd9e66"
const fakeListId = "69e6c7cef89a0dd817cd9e65"
const itemId = "69e7afd60764548ad02d48bd"
const fakeItemId = "69e7afd60764548ad02d47bd"
const emptyListId = "69e7bd953f67d334bb0e07b3"
let testItemId

describe("Retrieving existing item(s)", () => {
    describe("given valid item id", () => {
        it("GET /items/:iid should return an item", async () => {
            const response = await request(app).get(`/api/items/${itemId}`)
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })
    describe("given invalid item id", () => {
        it("GET /items/:iid should return a 404 error", async () => {
            const response = await request(app).get(`/api/items/${fakeItemId}`)
            expect(response.status).toBe(404)
        })
    })
    describe("given valid listId", () => {
        it("GET /items/user/:lid should return Array of items for the list", async () => {
            const response = await request(app).get(`/api/items/list/${listId}`)
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body["items"])).toBe(true)
        })
    })
    describe("given invalid listId", () => {
        it("GET /items/user/:uid should return a 404 error", async () => {
            const response = await request(app).get(`/api/items/user/${fakeListId}`)
            expect(response.status).toBe(404)
        })
    })
    describe("given valid listId without items", () => {
        it("GET /items/user/:uid should return a 404 error", async () => {
            const response = await request(app).get(`/api/items/user/${emptyListId}`)
            expect(response.status).toBe(404)
        })
    })
})

describe("Creating an item", () => {
    describe("given valid content and user", () => {
        it("POST /items should create a new item and add it to user items", async () => {
            const response = await request(app).post("/api/items").send({
                title: "title",
                list: listId
            })
            expect(response.status).toBe(201)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(response.body.item.title).toEqual("title")

            testItemId = response.body.item._id.toString()
            const listResponse = await request(app).get(`/api/items/list/${listId}`)
            expect(testItemId).toEqual(listResponse.body.items[0])
        })
    })
    describe("given invalid user", () => {
        it("POST /items should return a 404 error", async () => {
            const response = await request(app).post("/api/items").send({
                title: "title",
                list: fakeListId
            })
            expect(response.status).toBe(404)
        })
    })
    describe("given invalid content", () => {
        it("POST /items should return a 500 error", async () => {
            const response = await request(app).post("/api/items").send({
                list: listId
            })
            expect(response.status).toBe(500)
        })
    })
})

describe("Updating an existing item", () => {
    describe("given valid content", () => {
        it("PATCH /items/:iid should update item with given information", async () => {
            const response = await request(app).patch(`/api/items/${testItemId}`).send({
                title: "new title",
            })
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(response.body.item.title).toEqual("new title")
        })
    })
    describe("given invalid item id", () => {
        it("PATCH /items/:iid should return a 404 error", async () => {
            const response = await request(app).patch(`/api/items/${fakeItemId}`).send({
                title: "new title",
            })
            expect(response.status).toBe(404)
        })
    })
})

describe("Deleting an existing item", () => {
    describe("given valid item id and user", () => {
        it("DELETE /items/:iid should delete the item and remove from list items", async () => {
            const response = await request(app).delete(`/api/items/${testItemId}`)
            expect(response.status).toBe(200)
            const listResponse = await request(app).get(`/api/items/list/${listId}`)
            expect(listResponse.body.items).not.toContain(testItemId)
        })
    })
    describe("given invalid item id", () => {
        it("DELETE /items/:iid should return a 404 error", async () => {
            const response = await request(app).delete(`/api/items/${fakeItemId}`)
            expect(response.status).toBe(404)
        })
    })
    // describe("given invalid user", () => {
    //     it("DELETE /items/:iid should return a 401 error", async () => {
    //         const response = await request(app).delete(`/api/items/${itemId}`)
    //         expect(response.status).toBe(401)
    //     })
    // })
})