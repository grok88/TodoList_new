import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = typeof initialState;

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

//action
export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        status
    } as const;
}
export const setAppErrorAC = (error: string | null) => {
    return {
        type: 'APP/SET-ERROR',
        error
    } as const;
}
export const setIsInitializedAC = (isInitialized: boolean) => {
    return {
        type: 'APP/SET-INITIALIZED',
        isInitialized
    } as const
}

//thunk
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
            } else {
            }
            dispatch(setIsInitializedAC(true));
        })
        // .finally(() => {
        //     dispatch(setIsInitializedAC(true));
        // })
}


export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>;
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>;
type ActionsType =
    SetAppStatusACType
    | setAppErrorACType
    | ReturnType<typeof setIsInitializedAC>;