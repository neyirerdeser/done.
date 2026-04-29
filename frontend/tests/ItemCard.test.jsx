import { render, fireEvent, screen } from '@testing-library/react'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { AuthContext } from '../src/context/auth-context.js'
import listReducer from '../src/lib/listSlice.js'

import ItemCard from '../src/components/items/ItemCard.jsx'

const mockItem = {
    _id: "123",
    title: "Item Title",
    detail: {
        completed: false
    }
}

const server = setupServer(
    http.get("http://localhost:5000/api/items/:iid", (req, res, ctx) => {
        return HttpResponse.json({ item: mockItem })
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test("opening details modal", async () => {
    render(<ItemCard itemId={mockItem._id} setItems={() => { }} />)

    const modal = await screen.findByTestId("modal")
    expect(modal).not.toHaveClass("translate-x-0")

    const element = await screen.findByTestId("item-card")
    fireEvent.click(element)
    expect(modal).toHaveClass("translate-x-0")
})