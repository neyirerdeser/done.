import { createSlice } from "@reduxjs/toolkit";

// merges reducers and actions per state managed (called a feature)

const listSlice = createSlice({
    name: 'lists',
    initialState: [],
    reducers: {
        // i've been using setLists with full db pulls for data integrity/consistency
        // so i wont make multiple reducers
        setLists: (state, action) => {
            return action.payload
        }
    }
})

export const { setLists } = listSlice.actions
export default listSlice.reducer