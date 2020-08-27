import {FilterValueType} from "../App";
import {v1} from "uuid";
import {TodolistType} from "../api/todolists-api";

// type ActionType = {
//     type: string
//     [key: string]: any
// }


export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST",
    id: string
}
export type AddTodolistActionType = {
    type: "ADD-TODOLIST",
    title: string,
    todoListId: string
}
export type ChangeTodolistTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE",
    title: string
    id: string
}
export type ChangeTodolistFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER",
    filter: FilterValueType
    id: string
}

export type ActionType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType;


const initialState: Array<TodolistDomainType> = [];

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}

// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописаному type в этом action (инструкции) я поменяю state

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    let stateCopy;
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(elem => elem.id !== action.id);
        }
        case 'ADD-TODOLIST': {
            let todoList: TodolistDomainType = {
                id: action.todoListId,
                title: action.title,
                filter: 'all',
                addedDate:'',
                order:0
            }
            return [...state, todoList];
        }
        case 'CHANGE-TODOLIST-TITLE' : {
            const todoList = state.find(tl => tl.id === action.id);
            if (todoList) {
                todoList.title = action.title;
            }
            return [...state];
        }
        case 'CHANGE-TODOLIST-FILTER' : {
            stateCopy = state.map(todoList => ({...todoList}));
            stateCopy.map(todoList => {
                if (todoList.id !== action.id) {
                    return todoList
                } else {
                    todoList.filter = action.filter;
                    return {
                        ...todoList
                    }
                }
            })
            return stateCopy;



        }
        default:
            return state;
        // throw new Error("I don't understand this type")
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title: title, todoListId: v1()}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', title: title, id}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValueType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter: filter, id}
}
