import {TaskStateType} from "../App";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsACType} from "./todolists-reducer";
import {tasksApi, TaskStatuses, TaskType, UpdateTaskPayloadType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


export type removeTaskACType = {
    type: "REMOVE-TASK";
    taskId: string;
    todoListId: string;
}
export type updateTaskACType = {
    type: "UPDATE-TASK";
    taskId: string;
    model: UpdateDomainTaskType;
    todoListId: string;
}
export type changeTitleStatusACType = {
    type: "CHANGE-TITLE-STATUS";
    taskId: string;
    title: string;
    todoListId: string;
}
export type AddTodolistACType = {
    type: "CHANGE-TITLE-STATUS";
    taskId: string;
    title: string;
    todoListId: string;
}
type SetTasksThunkType = ReturnType<typeof setTasksAC>;
type addTaskACType = ReturnType<typeof addTaskAC>;

export type ActionType =
    addTaskACType
    | removeTaskACType
    | updateTaskACType
    | changeTitleStatusACType
    | AddTodolistACType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsACType
    | SetTasksThunkType;


// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописаному type в этом action (инструкции) я поменяю state

const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionType): TaskStateType => {
    let stateCopy;
    switch (action.type) {
        case "SET-TASKS": {
            const copyState = {...state};
            copyState[action.todolistId] = action.tasks;
            return copyState;
        }

        case "SET-TODOLISTS":
            const copyState = {...state};
            action.todolists.map(tl => copyState[tl.id] = []);
            return copyState;

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

            stateCopy[action.task.todoListId] = [action.task, ...stateCopy[action.task.todoListId]];
            return stateCopy;

        case 'UPDATE-TASK' : {
            stateCopy = {
                ...state,
            };
            stateCopy[action.todoListId] = stateCopy[action.todoListId].map(t => {
                if (t.id !== action.taskId) {
                    return t;
                } else {
                    return {...t, ...action.model}
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
            stateCopy[action.todoList.id] = [];
            return stateCopy;

        default:
            return state;
        // throw new Error("I don't understand this type")
    }
}

export const removeTaskAC = (taskId: string, todoListId: string): removeTaskACType => {
    return {type: 'REMOVE-TASK', taskId, todoListId};
}
export const addTaskAC = (todoListId: string, task: TaskType) => {
    return {type: 'ADD-TASK', task} as const;
}
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskType, todoListId: string): updateTaskACType => {
    return {type: 'UPDATE-TASK', taskId, model, todoListId};
}
export const changeTitleStatusAC = (taskId: string, title: string, todoListId: string): changeTitleStatusACType => {
    return {type: 'CHANGE-TITLE-STATUS', taskId, title, todoListId};
}
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => {
    return {
        type: "SET-TASKS",
        tasks,
        todolistId
    } as const;
}

//THUNK


export const SetTasksThunk = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        tasksApi.getTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(todolistId, res.data.items));
            })
    }
}
export const addTaskTC = (title: string, todoListId: string) => {
    return (dispatch: Dispatch) => {
        tasksApi.createTask(todoListId, title)
            .then(res => {
                console.log(res.data);
                let task = res.data.data.item;
                dispatch(addTaskAC(todoListId, task));
            })
    }
}
export const removeTaskTC = (taskId: string, todoListId: string) => {

    return (dispatch: Dispatch) => {
        tasksApi.deleteTask(todoListId, taskId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todoListId));
                }
            })
    }
}

type UpdateDomainTaskType = {
    title?: string;
    description?: string;
    status?: number;
    priority?: number;
    startDate?: string;
    deadline?: string;
}

export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

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
}
