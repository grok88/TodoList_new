import {FilterValueType} from "../trash/App";
import {todolistsApi, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(elem => elem.id !== action.id);
        case 'ADD-TODOLIST':
            return [{...action.todoList, filter: 'all'}, ...state];
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
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
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
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: "SET-TODOLISTS",
    todolists
} as const);

//thunks
export const setTodolistsThunk = (dispatch: Dispatch<ActionType>) => {
    todolistsApi.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    todolistsApi.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId));
            }
        });
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistsApi.createTodolist(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.data.item));
        });
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistsApi.updateTodolistTitle(todolistId, title)
        .then(res => {
            // debugger;
            dispatch(changeTodolistTitleAC(todolistId, title));
        });
}

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}

export type ActionType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistsACType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>