import { setAllItemsDashboard } from "@/redux/recordSlice"
import { STORE_API_END_POINT } from "@/utils/constants"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


export const useGetAllItems = () => {
     
    const dispatch =useDispatch();
    useEffect(()=>{
       const fetchAllItems=async()=>{
          try {
             const response =await axios.get(`${STORE_API_END_POINT}/getallitems`,{withCredentials:true});
             console.log(response)
             if(response.data.success){
                 dispatch(setAllItemsDashboard(response.data.record))
             }
          } catch (error) {
            console.log(error)
          }
       }

       fetchAllItems();
    },[])
 
}

