import { configureStore } from '@reduxjs/toolkit'
import  counterSlice  from './features/counter/counterSlice'
import authSlice from "./features/auth/authSlice"
export default configureStore({
  reducer: {
    counter:counterSlice,
    auth:authSlice
  },
})