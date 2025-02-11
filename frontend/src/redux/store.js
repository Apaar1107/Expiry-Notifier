import {combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import recordSlice from "./recordSlice";
import loaderSlice from "./loadingSlice"
import dashboardSlice from'./dashboardSlice'

import notificationsSlice from './noticationSlice'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
  import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
   
  }

  const rootReducer = combineReducers({
    auth:authSlice,
    record:recordSlice,
    loading:loaderSlice,
    dashboard:dashboardSlice,
   
    notifications:notificationsSlice
 })

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        
      },
    }),
});
export default store;



// const store=configureStore({
//     reducer:{
//         auth:authSlice,
//         record:recordSlice,
//         loading:loaderSlice,
//         dashboard:dashboardSlice
        
//     }
// })

// export default store;