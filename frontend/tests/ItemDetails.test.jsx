import { render, fireEvent, screen } from '@testing-library/react'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { AuthContext } from '../src/context/auth-context.js'
import listReducer from '../src/lib/listSlice.js'

import ItemDetails from '../src/components/items/ItemDetails.jsx'

const title= "Item Title"
const updatedTitle = "Updated Title"
const mockItem = {
    _id: "123",
    title,
    detail: {
        completed: false
    }
}

const server = setupServer(
    http.patch('http://localhost:5000/api/items/:iid', (req, res, ctx) => {
        return HttpResponse.json({item: {...mockItem, title: updatedTitle}})
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test("editing an item", async() => {
    render(<ItemDetails item={mockItem} setItem={() => { }} />)

    const input = await screen.findByPlaceholderText(title)
    const form = input.closest("form")

    expect(input).toHaveValue(title)

    fireEvent.change(input, {target: {value: updatedTitle}})
    fireEvent.submit(form)

    expect(input).toHaveValue(updatedTitle)
})