import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAuthState } from '../types/auth.type';
import { IUser } from '../types/user.type'

export interface UserState extends IUser { }

const initialState: IAuthState = {};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = undefined;
        }
    },
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer