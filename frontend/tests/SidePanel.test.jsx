import { render, fireEvent, screen } from '@testing-library/react'

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

// mock server
const server = setupServer(
    http.post('http://localhost:5000/api/lists', (req, res, ctx) => {
        return HttpResponse.json({ list: mockList })
    }),
    http.get('http://localhost:5000/api/lists/user/:uid', (req, res, ctx) => {
        return HttpResponse.json({ lists: [] })
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('creating new list', async () => {
    // Arrange
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
    // Act
    server.use(http.get('http://localhost:5000/api/lists/user/:uid', (req, res, ctx) => {
        return HttpResponse.json({ lists: [mockList] })
    }, {once: true}))
    const input = screen.getByPlaceholderText('New List')
    fireEvent.change(input, { target: { value: title } })
    const form = input.closest("form")
    fireEvent.submit(form)
    // Assert
    const listCard = await screen.findByTestId("list-card")
    expect(listCard).toHaveTextContent(title)
})
