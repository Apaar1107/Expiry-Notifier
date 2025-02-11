import { setAllItems } from "@/redux/recordSlice";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import {RECORD_API_END_POINT} from "../../utils/constants";

export const useGetAllCategoryItems=(id)=>{
    const dispatch=useDispatch();
      useEffect(()=>{
           const getItems=async()=>{
                  try {
                    const response=await axios.get(`${RECORD_API_END_POINT}/getallitemsbycategory/${id}`,{withCredentials:true});
                    if(response.data.success){
                        dispatch(setAllItems(response.data.allItems));
                    }
                  } catch (error) {
                    console.log(error)
                    
                  }
           }

           getItems();
      },[id,dispatch])    
}