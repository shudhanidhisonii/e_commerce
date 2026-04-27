import { createSlice } from "@reduxjs/toolkit"

const userSlice =createSlice({
    name:'User',
    initialState:{
        user:null
    },
    reducers:{
        setUser:(state, action)=>{
        state.user= action.payload
        }
    }
})

export const {setUser}= userSlice.actions
export default userSlice.reducer

//dispatch -> ye data store kr lo
//action -> Batata hai kya change karna hai
//reducer ->Actually state change karta hai