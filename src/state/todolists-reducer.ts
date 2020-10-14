import {FilterValueType} from "../trash/App";
import {todolistsApi, TodolistType} from "../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum ResultCodeStatuses {
    success = 0,
    failed = 1
}

const initialState: Array<TodolistDomainType> = [];

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType;
    entityStatus: RequestStatusType;
}

export const setTodolistsThunk = createAsyncThunk('todolists/setTodolists', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await todolistsApi.getTodolists();
        // dispatch(setTodolistsAC({todolists: res.data}));
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {todolists: res.data};

    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}));

    const res = await todolistsApi.deleteTodolist(todolistId);
    try {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return {todolistId: todolistId}
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await todolistsApi.createTodolist(title);
        if (res.data.resultCode === ResultCodeStatuses.success) {
            // dispatch(addTodolistAC({todoList: res.data.data.item}));
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return {todoList: res.data.data.item};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: { id: string, title: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await todolistsApi.updateTodolistTitle(param.id, param.title);
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {id: param.id, title: param.title}
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});


const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValueType }>) {
            let index = state.findIndex(elem => elem.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            let index = state.findIndex(elem => elem.id === action.payload.id);
            state[index].entityStatus = action.payload.status;
        },
    },
    extraReducers: builder => {
        builder.addCase(setTodolistsThunk.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            let index = state.findIndex(elem => elem.id === action.payload?.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'});
        });
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            let index = state.findIndex(elem => elem.id === action.payload.id);
            state[index].title = action.payload.title;
        });
    }
});

export const todolistsReducer = slice.reducer;

export const {changeTodolistFilterAC, changeTodolistEntityStatusAC} = slice.actions;

//thunks
// export const setTodolistsThunk = (dispatch: Dispatch) => {
//
//     dispatch(setAppStatusAC({status: 'loading'}));
//     todolistsApi.getTodolists()
//         .then(res => {
//             dispatch(setTodolistsAC({todolists: res.data}));
//             dispatch(setAppStatusAC({status: 'succeeded'}));
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch);
//         });
// }
// export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}));
//     dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}));
//     todolistsApi.deleteTodolist(todolistId)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(removeTodolistAC({todolistId}));
//                 dispatch(setAppStatusAC({status: 'succeeded'}));
//                 // dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'));
//             }
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch);
//         });
// }

// export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}));
//     todolistsApi.createTodolist(title)
//         .then(res => {
//             if (res.data.resultCode === ResultCodeStatuses.success) {
//                 dispatch(addTodolistAC({todoList: res.data.data.item}));
//                 dispatch(setAppStatusAC({status: 'succeeded'}));
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch);
//         });
// }
// export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}));
//     todolistsApi.updateTodolistTitle(todolistId, title)
//         .then(res => {
//             dispatch(changeTodolistTitleAC({id: todolistId, title}));
//             dispatch(setAppStatusAC({status: 'succeeded'}));
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch);
//         });
// }
