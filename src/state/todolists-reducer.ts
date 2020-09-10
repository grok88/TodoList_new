import {FilterValueType} from "../trash/App";
import {todolistsApi, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {setAppErrorAC, setAppErrorACType, setAppStatusAC, SetAppStatusACType, RequestStatusType} from "./app-reducer";
import {ResultCodeStatuses} from "./tasks-reducer";
import {handleServerNetworkError, handleServerAppError} from "../utils/error-utils";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(elem => elem.id !== action.id);
        case 'ADD-TODOLIST':
            return [{...action.todoList, filter: 'all', entityStatus: 'idle'}, ...state];
        case 'CHANGE-TODOLIST-TITLE' :
            return state.map(el => el.id === action.id ? ({...el, title: action.title}) : el);
        case 'CHANGE-TODOLIST-FILTER' :
            return state.map(todoList => {
                if (todoList.id !== action.id) {
                    return todoList
                } else {
                    todoList.filter = action.filter;
                    return {
                        ...todoList
                    }
                }
            })
        case 'CHANGE-TODOLIST-ENTITY-STATUS' :
            return state.map(todoList => {
                if (todoList.id !== action.id) {
                    return todoList
                } else {
                    todoList.entityStatus = action.status;
                    return {
                        ...todoList
                    }
                }
            })
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        default:
            return state;
    }
}

// actions
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const);
export const addTodolistAC = (todoList: TodolistType) => ({type: 'ADD-TODOLIST', todoList} as const);
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title,
    id
} as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValueType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter: filter,
    id
} as const);

export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    status,
    id
} as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: "SET-TODOLISTS",
    todolists
} as const);

//thunks
export const setTodolistsThunk = (dispatch: Dispatch<ActionType | SetAppStatusACType | setAppErrorACType>) => {

    dispatch(setAppStatusAC('loading'));
    todolistsApi.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data));
            dispatch(setAppStatusAC('succeeded'));
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch);
        });
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType | SetAppStatusACType | setAppErrorACType>) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));
    todolistsApi.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId));
                dispatch(setAppStatusAC('succeeded'));
                // dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'));
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch);
        });
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionType | SetAppStatusACType | setAppErrorACType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsApi.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === ResultCodeStatuses.success) {
                dispatch(addTodolistAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch);
        });
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType | SetAppStatusACType | setAppErrorACType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsApi.updateTodolistTitle(todolistId, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(todolistId, title));
            dispatch(setAppStatusAC('succeeded'));
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch);
        });
}

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistEntityStatusAC = ReturnType<typeof changeTodolistEntityStatusAC>;
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType;
    entityStatus: RequestStatusType;
}

export type ActionType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistsACType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ChangeTodolistEntityStatusAC
