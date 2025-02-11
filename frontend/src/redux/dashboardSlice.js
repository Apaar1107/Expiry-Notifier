import  { createSlice } from "@reduxjs/toolkit";

const dashboardSlice=createSlice({
    name:"dashboard",
    initialState:{
        totalItems:0,
        totalCategories:0,
        totalValue:0,
        expectedValue:0,
        totalQuantity:0
    },
    reducers:{
        setTotalItems:(state,action)=>{
            state.totalItems=action.payload;
        },
        setTotalCategories:(state,action)=>{
            state.totalCategories=action.payload;
        },
        setTotalValue:(state,action)=>{
            state.totalValue=action.payload;
        },
        setExpectedValue:(state,action)=>{
            state.expectedValue=action.payload;
        },
        setTotalQuantity:(state,action)=>{
            state.totalQuantity=action.payload;
        }
    }
})


export const {setTotalItems,setTotalCategories,setTotalValue,setExpectedValue,setTotalQuantity}=dashboardSlice.actions;
export default dashboardSlice.reducer;