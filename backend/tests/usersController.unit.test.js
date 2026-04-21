import request from "supertest"
import app from "../src/server.js"

const username = "testUser"
const password = "test123"

describe("Retrieving existing users", () => {
    it("GET /users should return a list of users", async () => {
        const response = await request(app).get("/api/users")
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body["users"])).toBe(true)

    })
})

describe("Signing up a new user", () => {
    // describe("Given valid username", () => {
    //     it("POST /users/signup should return new users id and token", async () => {
            // i dont want to clutter the db with users from testing
            // putting it aside till I learn mock db
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