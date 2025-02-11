import { createSlice } from "@reduxjs/toolkit";

const recordSlice =createSlice({
    name:"record",
    initialState:{
        allCategories:[],
        allItems:[],
        allItemsDashboard:[],
        // allExpired:[],
        // allSoonExpire:[],
        // allRectlyAdded:[],
        itemData:{},
    },
    reducers:{
        setAllCategories:(state,action)=>{
            state.allCategories=action.payload;
        },
        setAllItems:(state,action)=>{
            state.allItems=action.payload;
        },
        setAllItemsDashboard:(state,action)=>{
            state.allItemsDashboard=action.payload;
        },
       
        setItemData:(state,action)=>{
            state.itemData=action.payload;
        }
    }

})

export const{setAllCategories,setAllItems,setAllItemsDashboard,setItemData}=recordSlice.actions;
export default recordSlice.reducer;