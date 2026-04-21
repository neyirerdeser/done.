import request from "supertest"
import app from "../src/server.js"

const userId = "69e6c7cef89a0dd817cd9e65"
const fakeUserId = "69e6c7e4f89a0dd817cd9e66"
const emptyUserId = "69e78acd5c1b55dbb8928a1d"

const listId = "69e6c7e4f89a0dd817cd9e66"
const fakeListId = "69e6c7cef89a0dd817cd9e65"
let testListId

describe("Retrieving existing list(s)", () => {
    describe("given valid list id", () => {
        it("GET /lists/:lid should return a list", async () => {
            const response = await request(app).get(`/api/lists/${listId}`)
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })
    describe("given invalid list id", () => {
        it("GET /lists/:lid should return a 404 error", async () => {
            const response = await request(app).get(`/api/lists/${fakeListId}`)
            expect(response.status).toBe(404)
        })
    })
    describe("given valid userId", () => {
        it("GET /lists/user/:uid should return Array of lists for the user", async () => {
            const response = await request(app).get(`/api/lists/user/${userId}`)
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body["lists"])).toBe(true)
        })
    })
    describe("given invalid userId", () => {
        it("GET /lists/user/:uid should return a 404 error", async () => {
            const response = await request(app).get(`/api/lists/user/${fakeUserId}`)
            expect(response.status).toBe(404)
        })
    })
    describe("given valid userId without lists", () => {
        it("GET /lists/user/:uid should return a 404 error", async () => {
            const response = await request(app).get(`/api/lists/user/${emptyUserId}`)
            expect(response.status).toBe(404)
        })
    })
})

describe("Creating a list", () => {
    describe("given valid content and user", () => {
        it("POST /lists should create a new list and add it to user lists", async () => {
            const response = await request(app).post("/api/lists").send({
                title: "title",
                creator: userId
            })
            expect(response.status).toBe(201)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(response.body.list.title).toEqual("title")
            expect(response.body.list.items).toEqual([])
            expect(response.body.list.iconName).toEqual("List")

            testListId = response.body.list._id.toString()
            const creatorResponse = await request(app).get(`/api/lists/user/${userId}`)
            expect(testListId).toEqual(creatorResponse.body.lists[0]._id.toString())
        })
    })
    describe("given invalid user", () => {
        it("POST /lists should return a 404 error", async () => {
            const response = await request(app).post("/api/lists").send({
                title: "title",
                creator: fakeUserId
            })
            expect(response.status).toBe(404)
        })
    })
    describe("given invalid content", () => {
        it("POST /lists should return a 500 error", async () => {
            const response = await request(app).post("/api/lists").send({
                creator: userId
            })
            expect(response.status).toBe(500)
        })
    })
})

describe("Updating an existing list", () => {
    describe("given valid content", () => {
        it("PATCH /lists/:lid should update list with given information", async () => {
            const response = await request(app).patch(`/api/lists/${testListId}`).send({
                title: "new title",
                iconName: "newIcon",
            })
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(response.body.list.title).toEqual("new title")
            expect(response.body.list.iconName).toEqual("newIcon")
        })
    })
    describe("given invalid list id", () => {
        it("PATCH /lists/:lid should return a 404 error", async () => {
            const response = await request(app).patch(`/api/lists/${fakeListId}`).send({
                title: "new title",
                iconName: "newIcon",
            })
            expect(response.status).toBe(404)
        })
    })
    // describe("given invalid user", () => {
    //     it("PATCH /lists/:lid should return a 401 error", async () => {
    //         const response = await request(app).patch(`/api/lists/${testListId}`).send({
    //             title: "new title",
    //             iconName: "newIcon",
    //             user: fakeUserId
    //         })
    //         expect(response.status).toBe(401)
    //     })
    // })
})

describe("Deleting an existing list", () => {
    describe("given valid list id and user", () => {
        it("DELETE /lists/:lid should delete the list and remove from user lists", async () => {
            const response = await request(app).delete(`/api/lists/${testListId}`)
            expect(response.status).toBe(200)
            const creatorResponse = await request(app).get(`/api/lists/user/${userId}`)
            expect(creatorResponse.body.lists).not.toContain(testListId)
        })
    })
    describe("given invalid list id", () => {
        it("DELETE /lists/:lid should return a 404 error", async () => {
            const response = await request(app).delete(`/api/lists/${fakeListId}`)
            expect(response.status).toBe(404)
        })
    })
    // describe("given invalid user", () => {
    //     it("DELETE /lists/:lid should return a 401 error", async () => {
    //         const response = await request(app).delete(`/api/lists/${listId}`)
    //         expect(response.status).toBe(401)
    //     })
    // })
})