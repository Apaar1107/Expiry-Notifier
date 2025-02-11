import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
       
        store:null
    },
    reducers:{
         
        setStore:(state,action)=>{
            state.store=action.payload;
        }
    }
})
export const {setStore}=authSlice.actions;
export default authSlice.reducer;