import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { AuthContext } from '../src/context/auth-context'
import listReducer from '../src/lib/listSlice.js'

import SidePanel from '../src/components/lists/SidePanel'

const title = "List Title"
const mockList = {
    _id: "123",
    title,
    iconName: "List"
}

const store = configureStore({ reducer: { lists: listReducer } })

window.confirm = vi.fn(() => true)

// mock server
const server = setupServer(
    http.post('http://localhost:5000/api/lists', (req, res, ctx) => {
        return HttpResponse.json({ list: mockList })
    }),
    http.get('http://localhost:5000/api/lists/user/:uid', (req, res, ctx) => {
        return HttpResponse.json({ lists: [] })
    }),
    http.delete('http://localhost:5000/api/lists/:lid', (req, res, ctx) => {
        return HttpResponse.json({ message: "deleted" })
    }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('creating new list', async () => {
    render(
        <Provider store={store}>
            <AuthContext.Provider value={{
                loggedIn: true,
                token: 'mock-token',
                userId: "123"
            }}>
                <MemoryRouter initialEntries={['/']}>
                    <SidePanel />
                </MemoryRouter>
            </AuthContext.Provider>
        </Provider>
    )

    const input = screen.getByPlaceholderText('New List')
    const form = input.closest("form")

    expect(screen.queryByTestId("list-card")).not.toBeInTheDocument()

    server.use(http.get('http://localhost:5000/api/lists/user/:uid', (req, res, ctx) => {
        return HttpResponse.json({ lists: [mockList] })
    }, { once: true }))

    fireEvent.change(input, { target: { value: title } })
    fireEvent.submit(form)

    const listCard = await screen.findByTestId("list-card")
    expect(listCard).toHaveTextContent(title)
})

test("deleting a list", async () => {
    render(
        <Provider store={store}>
            <AuthContext.Provider value={{
                loggedIn: true,
                token: 'mock-token',
                userId: "123"
            }}>
                <MemoryRouter initialEntries={['/']}>
                    <SidePanel />
                </MemoryRouter>
            </AuthContext.Provider>
        </Provider>
    )
    server.use(http.get('http://localhost:5000/api/lists/user/:uid', (req, res, ctx) => {
        return HttpResponse.json({ lists: [mockList] })
    }, { once: true }))

    const deleteButton = await screen.findByTestId("list-delete")
    expect(deleteButton).toBeInTheDocument()

    fireEvent.click(deleteButton)
    await waitFor(() => {
        const listCard = screen.queryByTestId("list-card")
        expect(listCard).not.toBeInTheDocument()
    })
})
