import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useMutation } from '@tanstack/react-query'

import { api } from '@/api'
import { buildUrl } from '@/utils'
import { type AuthState, loginSuccess, logoutAction, modifyUserAction } from '@/redux/features/authReducer'

export interface IRegisterBody {
  username: string
  name: string
  email: string
  password: string
}

export type ILoginBody = Pick<IRegisterBody, 'username' | 'password' | 'email'>

interface IMutationError {
  error: string
  message: string
}

export interface IMutationResponse {
  message: string
  user: IUser
}

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const [error, setError] = useState<IMutationError>()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

  const loginRequest = useCallback(async (userData: ILoginBody) => {
    setError(undefined)
    const url = buildUrl('/auth/login')
    return await api<Omit<AuthState, 'isAuthenticated'>>(url, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }, [])

  const registerRequest = useCallback(async (userData: IRegisterBody) => {
    setError(undefined)
    const url = buildUrl('/auth/register')
    return await api<IMutationResponse>(url, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }, [])

  const modifyUserRequest = useCallback(async (userData: Partial<IUser>) => {
    setError(undefined)
    const url = buildUrl(`/auth/user/${userData.id}`)
    return await api<IMutationResponse>(url, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  }, [])

  const { mutateAsync: login, isPending: isLoadingLogin } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      dispatch(loginSuccess(data))
    },
    onError: setError
  })

  const { data: registerResult, mutateAsync: register, isPending: isLoadingRegister } = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => { },
    onError: setError
  })

  const { data: modifyUserResult, mutateAsync: modifyUser, isPending: isLoadingModifyUser } = useMutation({
    mutationFn: modifyUserRequest,
    onSuccess: (data) => {
      dispatch(modifyUserAction(data.user))
      return data
    },
    onError: setError
  })

  const logout = useCallback(async () => {
    dispatch(logoutAction())
  }, [])

  useEffect(() => setError(undefined), [])

  return {
    data: registerResult ?? modifyUserResult,
    isAuthenticated,
    isLoading: isLoadingLogin || isLoadingRegister || isLoadingModifyUser,
    error,
    login,
    logout,
    register,
    modifyUser
  }
}

export type AuthContext = ReturnType<typeof useAuth>
