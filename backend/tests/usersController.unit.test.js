import request from "supertest"
import app from "../src/server.js"

const username = "testUser"
const password = "test123"
const userId = "69e6c7cef89a0dd817cd9e65"
const fakeUserId = "69e6c7cef89a0dd817cd9e66"

describe("Retrieving existing users", () => {
    describe("given valid user id", () => {
        it("GET /user/:uid should return user", async () => {
            const response = await request(app).get(`/api/user/${userId}`)
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })
    describe("given invalid user id", () => {
        it("GET /user/:uid should return a 404 error", async () => {
            const response = await request(app).get(`/api/user/${fakeUserId}`)
            expect(response.status).toBe(404)
        })
    })
})

describe("Signing up a new user", () => {
    // describe("Given valid username", () => {
    //     it("POST /users/signup should return new users id and token", async () => {
    // // i dont want to clutter the db with users from testing
    // // putting it aside till I learn mock db
    //     })
    // })
    describe("Given invalid (already existing) username", () => {
        it("POST /users/signup should return a 422 error", async () => {
            const response = await request(app).post("/api/users/signup").send({ username, password })
            expect(response.status).toBe(422)
        })
    })
})

describe("Logging in with existing user", () => {
    describe("Given valid username and password", () => {
        it("POST /users/login should return signed users id and token", async () => {
            const response = await request(app).post("/api/users/login").send({ username, password })
            expect(response.status).toBe(200)
        })
    })
    describe("Given invalid username", () => {
        it("POST /users/login should return a 404 error", async () => {
            const response = await request(app).post("/api/users/login").send({
                username: "non-existing username",
                password
            })
            expect(response.status).toBe(404)
        })
    })
    describe("Given invalid password", () => {
        it("POST /users/login should return a 403 error", async () => {
            const response = await request(app).post("/api/users/login").send({
                username,
                password: "wrong password"
            })
            expect(response.status).toBe(403)
        })
    })
})