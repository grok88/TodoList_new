import {TaskStateType} from "../trash/App";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsACType} from "./todolists-reducer";
import {tasksApi, TaskType, UpdateTaskPayloadType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionType): TaskStateType => {
    let stateCopy;
    switch (action.type) {
        case "SET-TASKS":
            return {
                ...state,
                [action.todolistId]: action.tasks
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
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
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

//thunks
export const setTasksThunk = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    tasksApi.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(todolistId, res.data.items));
        })
}
export const addTaskTC = (title: string, todoListId: string) => (dispatch: Dispatch<ActionType>) => {
    tasksApi.createTask(todoListId, title)
        .then(res => {
            console.log(res.data);
            let task = res.data.data.item;
            dispatch(addTaskAC(todoListId, task));
        })
}
export const removeTaskTC = (taskId: string, todoListId: string) => (dispatch: Dispatch<ActionType>) => {
    tasksApi.deleteTask(todoListId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todoListId));
            }
        })
}
export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskType) => (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

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

    tasksApi.updateTask(todolistId, taskId, apiModel).then(() => {
        const action = updateTaskAC(taskId, domainModel, todolistId)
        dispatch(action)
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
    | ReturnType<typeof setTasksAC>;
