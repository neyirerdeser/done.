import User from "../src/models/user.js"
import { getUserById, login, signup } from "../src/controllers/usersController.js"

const username = "testUser"
const password = "test123"

const mockUserId = "69e6c7cef89a0dd817cd9e65"
const wrongUserId = "69e6c7cef89a0dd817cd9e66"
const invaliUserdId = "123abc"

process.env.PRIVATE_KEY = 'mock-private-key'

const mockUser = new User({
    _id: mockUserId,
    lists: [],
    username,
    password
})

User.prototype.save = jest.fn().mockImplementation(() => { })

const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
const next = jest.fn()

describe("UsersControllers", () => {
    describe("getUserById : GET /user/:uid", () => {
        it("given valid user id, should return user", async () => {
            User.findById = jest.fn().mockReturnValueOnce(mockUser)
            const req = { params: { uid: mockUserId } }
            await getUserById(req, res)
            expect(res.json).toHaveBeenCalledWith({ user: mockUser })
        })
        it("given invalid user id, should return a 404 error", async () => {
            User.findById = jest.fn().mockReturnValueOnce(null)
            const req = { params: { uid: wrongUserId } }
            await getUserById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid id type, should return a 400 error", async () => {
            const req = { params: { uid: invaliUserdId } }
            await getUserById(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }))
        })
    })
    describe("signup : POST /users/signup", () => {
        it("given valid username, should return new users id and token", async () => {
            const req = {
                body: {
                    username: "username",
                    password: "secret123"
                }
            }
            await signup(req, res)
            expect(User.prototype.save).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(201)
        })
        it("given invalid (already existing) username, should return a 422 error", async () => {
            User.prototype.save = jest.fn().mockImplementation(() => {
                throw new Error("duplicate key error")
            })
            const req = {
                body: {
                    username,
                    password: "secret123"
                }
            }
            await signup(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 422 }))
        })
    })
    describe("login : POST /users/login", () => {
        it("given valid username and password : should return signed users id and token", async () => {
            User.findOne = jest.fn().mockReturnValueOnce(mockUser)
            const req = {
                body: {
                    username,
                    password
                }
            }
            await login(req, res)
        })
        it("given invalid username, should return a 404 error", async () => {
            User.findOne = jest.fn().mockReturnValueOnce(null)
            const req = {
                body: {
                    username: "noNExistantUSernaME",
                    password
                }
            }
            await login(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }))
        })
        it("given invalid password, should return a 403 error", async () => {
            User.findOne = jest.fn().mockReturnValueOnce(mockUser)
            const req = {
                body: {
                    username,
                    password: "wrongPassword"
                }
            }
            await login(req, res, next)
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 403 }))
        })
    })
})