import { render, fireEvent, screen } from '@testing-library/react'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { AuthContext } from '../src/context/auth-context'
import listReducer from '../src/lib/listSlice.js'

import ListItems from '../src/components/items/ListItems.jsx'

const title = "Item Title"
const mockItem = {
    _id: "123",
    title,
    detail: {
        completed: false
    }
}
const mockList = {
    _id: "456",
    title: "List",
    items: []
}

const store = configureStore({ reducer: { lists: listReducer } })

const server = setupServer(
    http.get('http://localhost:5000/api/lists/:lid', (req, res, ctx) => {
        return HttpResponse.json({ list: mockList })
    }),
    http.get('http://localhost:5000/api/items/list/:lid', (req, res, ctx) => {
        return HttpResponse.json({ items: [] })
    }),
    http.get('http://localhost:5000/api/items/:iid', (req, res, ctx) => {
        return HttpResponse.json({ item: mockItem })
    }),
    http.post('http://localhost:5000/api/items', (req, res, ctx) => {
        return HttpResponse.json({ item: mockItem })
    }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test("creating new item", async () => {
    render(
        <Provider store={store}>
            <AuthContext.Provider value={{
                loggedIn: true,
                token: 'mock-token',
                userId: "123"
            }}>
                <MemoryRouter initialEntries={['/']}>
                    <ListItems />
                </MemoryRouter>
            </AuthContext.Provider>
        </Provider>

    )
    
    // moving before server.use fixed the issue where the special get method was being used before the render
    const input = await screen.findByPlaceholderText("New Item")

    server.use(
        http.get('http://localhost:5000/api/items/list/:lid', (req, res, ctx) => {
            return HttpResponse.json({ items: [mockItem] })
        }, { once: true }),
    )

    const form = input.closest("form")
    fireEvent.change(input, { target: { value: title } })
    fireEvent.submit(form)

    const itemCard = await screen.findByTestId("item-card")
    expect(itemCard).toHaveTextContent(title)
})