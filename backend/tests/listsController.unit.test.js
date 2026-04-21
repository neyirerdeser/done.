import request from "supertest"
import app from "../src/server.js"

/*
describe("", () => {
    it("", async () => {})
})
*/

const userId = "69e6c7cef89a0dd817cd9e65"
const listId = "69e6c7e4f89a0dd817cd9e66"

describe("Retrieving existing list(s)", () => {
    describe("given valid list id", () => {
        it("GET /lists/:lid should return a list", async () => {
            const response = await request(app).get(`/api/lists/${listId}`)
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })
    describe("given valid userId", () => {
        it("GET /lists/user/:uid should return Array of lists for the user", async () => {
            const response = await request(app).get(`/api/lists/user/${userId}`)
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body["lists"])).toBe(true)
        })
    })
})

describe("Creating a list", () => {
    describe("given valid content and user", () => {
        it("POST /lists should create and return a new list", async () => {
            const response = await request(app).post("/api/lists").send({
                title: "title",
                creator: userId
            })
            expect(response.status).toBe(201)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            const creatorResponse = await request(app).get(`/api/lists/user/${userId}`)
            expect(response.body.list._id.toString()).toEqual(creatorResponse.body.lists[0]._id.toString())
        })
    })
    // describe()
})