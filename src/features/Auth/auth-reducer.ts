import {setAppStatusAC} from '../../state/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authAPI, FieldErrorType, LoginParamsType} from '../../api/todolists-api';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const loginTC = createAsyncThunk<{ isLoginIn: boolean }, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsError?: Array<FieldErrorType> }
}>('auth/login', async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.login(data);

        if (res.data.resultCode === 0) {
            // thunkAPI.dispatch(setIsLoggedInAC({value: true}));
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return {isLoginIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors});
        }
    } catch (err) {
        const error: AxiosError = err;
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsError: undefined});
    }
});

export const logoutTC = createAsyncThunk('auth/logout', async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors});
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsError: undefined});
    }
});


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
                // if (action.payload) {
                state.isLoggedIn = action.payload.isLoginIn;
                // }
            }
        );
        builder.addCase(logoutTC.fulfilled, (state, action) => {
                // if (action.payload) {
                state.isLoggedIn = false;
                // }
            }
        );
    }
});

//reducer
export const authReducer = slice.reducer;
//actions
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;


// thunks
// export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.login(data)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: true}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }

//ASYNC -AWAIT
// export const logoutTC = () => async (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//
//     try {
//         const res = await authAPI.logout()
//         if (res.data.resultCode === 0) {
//             dispatch(setIsLoggedInAC({value: false}))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         } else {
//             handleServerAppError(res.data, dispatch)
//         }
//     } catch (error) {
//         handleServerNetworkError(error, dispatch);
//     }
//
// }
//

