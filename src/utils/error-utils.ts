import {setAppErrorAC, setAppErrorACType, setAppStatusAC, SetAppStatusACType} from "../state/app-reducer";
import {CommonRespType} from "../api/todolists-api";
import {Dispatch} from "redux";

export const handleServerAppError = <T>(data : CommonRespType<T>, dispatch:Dispatch<ErrorUtilsType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]));
    } else {
        dispatch(setAppErrorAC('Some error'));
    }
    dispatch(setAppStatusAC('failed'));
}


export const handleServerNetworkError = (error: {message: string}, dispatch:Dispatch< ErrorUtilsType>) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}

type ErrorUtilsType = SetAppStatusACType | setAppErrorACType;