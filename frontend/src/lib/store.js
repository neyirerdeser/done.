import {configureStore} from '@reduxjs/toolkit'
import listReducer from './listSlice'

// all the reducers would be here
// for any state thats being managed by redux

const store = configureStore({
    reducer: {
        lists: listReducer
    }
})

export default store