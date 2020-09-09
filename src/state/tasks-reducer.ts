import {
    AddTodolistActionType,
    ChangeTodolistEntityStatusAC,
    changeTodolistEntityStatusAC,
    RemoveTodolistActionType,
    SetTodolistsACType
} from "./todolists-reducer";
import {tasksApi, TaskType, UpdateTaskPayloadType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppErrorACType, setAppStatusAC, SetAppStatusACType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";


const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionType): TaskStateType => {
    let stateCopy;
    switch (action.type) {
        case "SET-TASKS":
            return {
                ...state,
                [action.todolistId]: action.tasks.map(task => ({...task, entityStatus: 'idle'})),
            }
        case "SET-TODOLISTS":
            const copyState = {...state};
            action.todolists.map(tl => copyState[tl.id] = []);
            return copyState;
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        case 'REMOVE-TODOLIST' : {
            stateCopy = {
                ...state,
            }
            delete stateCopy[action.id];
            return stateCopy;
        }
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => {
                    if (t.id !== action.taskId) {
                        return t;
                    } else {
                        return {
                            ...t,
                            entityStatus: action.status
                        }
                    }
                })
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK' :
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => {
                    if (t.id !== action.taskId) {
                        return t;
                    } else {
                        return {...t, ...action.model}
                    }
                })
            };
        case 'ADD-TODOLIST' :
            return {
                ...state,
                [action.todoList.id]: []
            };
        default:
            return state;
    }
}

//actions
export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE-TASK',
    taskId,
    todoListId
} as const);
export const addTaskAC = (todoListId: string, task: TaskType) => ({type: 'ADD-TASK', task} as const);
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskType, todoListId: string) => ({
    type: 'UPDATE-TASK',
    taskId,
    model,
    todoListId
} as const);
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => ({
    type: "SET-TASKS",
    tasks,
    todolistId
} as const);
export const changeTaskEntityStatus = (todoListId: string, taskId: string, status: RequestStatusType) => {
    return {
        type: 'CHANGE-TASK-ENTITY-STATUS',
        todoListId,
        taskId,
        status
    } as const
}

//enum
export enum ResultCodeStatuses {
    success = 0,
    failed = 1
}

//thunks
export const setTasksThunk = (todolistId: string) => (dispatch: Dispatch<ActionType | SetAppStatusACType>) => {
    dispatch(setAppStatusAC('loading'));
    tasksApi.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(todolistId, res.data.items));
            dispatch(setAppStatusAC('succeeded'));
        })
}
export const addTaskTC = (title: string, todoListId: string) => (dispatch: Dispatch<ActionType | SetAppStatusACType | setAppErrorACType>) => {
    dispatch(setAppStatusAC('loading'));
    tasksApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === ResultCodeStatuses.success) {
                let task = res.data.data.item;
                dispatch(addTaskAC(todoListId, task));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch);
        });
}
export const removeTaskTC = (taskId: string, todoListId: string) => (dispatch: Dispatch<ActionType | SetAppStatusACType | ChangeTodolistEntityStatusAC | setAppErrorACType>) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'));
    dispatch(changeTaskEntityStatus(todoListId, taskId, "loading"));
    tasksApi.deleteTask(todoListId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todoListId));
                dispatch(setAppStatusAC('succeeded'));
                dispatch(changeTodolistEntityStatusAC(todoListId, 'succeeded'));
                dispatch(changeTaskEntityStatus(todoListId, taskId, 'succeeded'));
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch);
        });
}
export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskType) => (dispatch: Dispatch<ActionType | SetAppStatusACType | setAppErrorACType>, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTaskEntityStatus(todolistId, taskId, "loading"));
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        console.warn('Task not found in state');
        return;
    }
    const apiModel: UpdateTaskPayloadType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...domainModel
    }

    tasksApi.updateTask(todolistId, taskId, apiModel).then((res) => {
        if (res.data.resultCode === ResultCodeStatuses.success) {
            const action = updateTaskAC(taskId, domainModel, todolistId)
            dispatch(action);
            dispatch(setAppStatusAC('succeeded'));
            dispatch(changeTaskEntityStatus(todolistId, taskId, 'succeeded'));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    })
        .catch(error => {
            handleServerNetworkError(error.data, dispatch);
        })

}

// types
type UpdateDomainTaskType = {
    title?: string;
    description?: string;
    status?: number;
    priority?: number;
    startDate?: string;
    deadline?: string;
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType;
}
export type TaskStateType = {
    [key: string]: Array<TaskDomainType>;
}

// export type AddTodolistACType = {
//     type: "CHANGE-TITLE-STATUS";
//     taskId: string;
//     title: string;
//     todoListId: string;
// }
export type ActionType =
    ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    // | AddTodolistACType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsACType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskEntityStatus>

