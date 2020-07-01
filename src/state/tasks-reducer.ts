import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";


export type removeTaskACType = {
    type: "REMOVE-TASK",
    taskId: string,
    todoListId: string
}
export type addTaskACType = {
    type: "ADD-TASK",
    title: string,
    todoListId: string
}
export type changeTaskStatusACType = {
    type: "CHANGE-TASK-STATUS",
    taskId: string,
    isDone: boolean,
    todoListId: string
}
export type changeTitleStatusACType = {
    type: "CHANGE-TITLE-STATUS",
    taskId: string,
    title: string,
    todoListId: string
}
export type AddTodolistACType = {
    type: "CHANGE-TITLE-STATUS",
    taskId: string,
    title: string,
    todoListId: string
}

export type ActionType =
    addTaskACType
    | removeTaskACType
    | changeTaskStatusACType
    | changeTitleStatusACType
    | AddTodolistACType
    | AddTodolistActionType
    | RemoveTodolistActionType;


// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописаному type в этом action (инструкции) я поменяю state

const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionType):TaskStateType => {
    let stateCopy;
    switch (action.type) {
        case 'REMOVE-TASK':
            stateCopy = {
                ...state,
            }
            stateCopy[action.todoListId] = stateCopy[action.todoListId].filter(t => t.id !== action.taskId);
            return stateCopy;
        case 'REMOVE-TODOLIST' : {
            stateCopy = {
                ...state,
            }
            delete stateCopy[action.id];
            return stateCopy;
        }
        case 'ADD-TASK':
            stateCopy = {
                ...state,
            }
            let newTask = {id: v1(), title: action.title, isDone: false};
            stateCopy[action.todoListId] = [newTask, ...stateCopy[action.todoListId]];
            return stateCopy;
        case 'CHANGE-TASK-STATUS' : {
            stateCopy = {
                ...state,
            };

            let task = stateCopy[action.todoListId].find(t => t.id === action.taskId);
            if (task) {
                task.isDone = action.isDone;
            }
            stateCopy[action.todoListId] = stateCopy[action.todoListId].map(t => {
                if (t.id !== action.taskId) {
                    return t;
                } else {
                    return {...t, isDone: action.isDone}
                }
            });
            return stateCopy;
        }
        case 'CHANGE-TITLE-STATUS' :
            stateCopy = {
                ...state,
            };

            let task = stateCopy[action.todoListId].find(t => t.id === action.taskId);
            if (task) {
                task.title = action.title;
            }
            stateCopy[action.todoListId] = stateCopy[action.todoListId].map(t => {
                if (t.id !== action.taskId) {
                    return t;
                } else {
                    return {...t, title: action.title}
                }
            });
            return stateCopy;
        case 'ADD-TODOLIST' :
            stateCopy = {
                ...state,
            };
            stateCopy[action.todoListId] = [];
            return stateCopy;
        default:
            return state;
        // throw new Error("I don't understand this type")
    }
}

export const removeTaskAC = (taskId: string, todoListId: string): removeTaskACType => {
    return {type: 'REMOVE-TASK', taskId, todoListId};
}
export const addTaskAC = (title: string, todoListId: string): addTaskACType => {
    return {type: 'ADD-TASK', title, todoListId};
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string): changeTaskStatusACType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todoListId};
}
export const changeTitleStatusAC = (taskId: string, title: string, todoListId: string): changeTitleStatusACType => {
    return {type: 'CHANGE-TITLE-STATUS', taskId, title, todoListId};
}
// export const AddTodolistAC = (taskId: string, title: string, todoListId: string): AddTodolistACType => {
//     return {type: 'CHANGE-TITLE-STATUS', taskId, title, todoListId};
// }

