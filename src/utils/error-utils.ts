import {setAppErrorAC, setAppStatusAC} from "../state/app-reducer";
import {CommonRespType} from "../api/todolists-api";
import {Dispatch} from "redux";

export const handleServerAppError = <T>(data: CommonRespType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}));
    } else {
        dispatch(setAppErrorAC({error: 'Some error'}));
    }
    dispatch(setAppStatusAC({status: 'failed'}));
}


export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(setAppErrorAC({error: error.message}))
    dispatch(setAppStatusAC({status: 'failed'}));
}

