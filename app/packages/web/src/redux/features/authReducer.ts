import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  user?: IUser
  token?: string
  isAuthenticated: boolean
}

export const AUTH_STORAGE_KEY = 'auth_data'

const initialState: AuthState = (() => {
  const authData = localStorage.getItem(AUTH_STORAGE_KEY) ?? 'null'
  const auth = JSON.parse(authData) as Omit<AuthState, 'isAuthenticated'>

  return auth
    ? { ...auth, isAuthenticated: true }
    : { isAuthenticated: false }
})()

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<Omit<AuthState, 'isAuthenticated'>>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logoutAction: (state) => {
      state.isAuthenticated = false
      state.user = undefined
      state.token = undefined
    },
    modifyUserAction: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { loginSuccess, logoutAction, modifyUserAction } = authSlice.actions

export default authSlice.reducer
