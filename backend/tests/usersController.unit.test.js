import request from "supertest"
import app from "../src/server.js"

const username = "testUser"
const password = "test123"
const userId = "69e6c7cef89a0dd817cd9e65"
const fakeUserId = "69e6c7e4f89a0dd817cd9e66"

beforeAll(() => {
    server = app.listen(5002)
})

afterAll(async() => {
    // await mongoose.connection.close()
    await server.close()
})


/*
describe("", () => {
    it("", async () => {})
})
*/

// describe("Retrieving existing users", () => {
//     describe("", () => {
//         it("", async () => {

//         })
//     })
// })

// describe("Signing up a new user", () => {
//     describe("", () => {
//         it("", async () => {

//         })
//     })
// })

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
                password : "wrong password"
            })
            expect(response.status).toBe(403)
        })
    })
})