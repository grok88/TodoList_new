import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";
import {TaskStatuses, TaskPriorities} from "../api/tasks-api";


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
    status: TaskStatuses,
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

export const tasksReducer = (state: TaskStateType = initialState, action: ActionType): TaskStateType => {
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
            let newTask = {
                id: v1(), title: action.title, status: TaskStatuses.New,
                todoListId: action.todoListId,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            };
            stateCopy[action.todoListId] = [newTask, ...stateCopy[action.todoListId]];
            return stateCopy;
        case 'CHANGE-TASK-STATUS' : {
            stateCopy = {
                ...state,
            };
            stateCopy[action.todoListId] = stateCopy[action.todoListId].map(t => {
                if (t.id !== action.taskId) {
                    return t;
                } else {
                    return {...t, status: action.status}
                }
            });
            return stateCopy;
        }
        case 'CHANGE-TITLE-STATUS' :
            stateCopy = {
                ...state,
            };

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
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todoListId: string): changeTaskStatusACType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todoListId};
}
export const changeTitleStatusAC = (taskId: string, title: string, todoListId: string): changeTitleStatusACType => {
    return {type: 'CHANGE-TITLE-STATUS', taskId, title, todoListId};
}
// export const AddTodolistAC = (taskId: string, title: string, todoListId: string): AddTodolistACType => {
//     return {type: 'CHANGE-TITLE-STATUS', taskId, title, todoListId};
// }

