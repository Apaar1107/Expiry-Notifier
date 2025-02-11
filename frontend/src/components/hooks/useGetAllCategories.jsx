import axios from "axios"
import { useEffect } from "react"
import {STORE_API_END_POINT} from "../../utils/constants.js";
import { useDispatch } from "react-redux";
import { setAllCategories } from "@/redux/recordSlice.js";
export const useGetAllCategoies= ()=>{

    const dispatch=useDispatch();
    
    
    
    
    useEffect(()=>{
        const getCategories=async()=>{

            try {
                const response =await axios.get(`${STORE_API_END_POINT}/getallcategories`,{withCredentials:true});
            if(response.data.success){
                
                dispatch(setAllCategories(response.data.allCategories));
            }
            } catch (error) {
                console.log(error)
            }
        
            
        
           }
       getCategories();

    },[])
}