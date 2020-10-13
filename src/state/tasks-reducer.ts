import {
    addTodolistAC,
    AddTodolistActionType,
    changeTodolistEntityStatusAC,
    removeTodolistAC,
    RemoveTodolistActionType,
    ResultCodeStatuses,
    setTodolistsAC,
    SetTodolistsACType
} from "./todolists-reducer";
import {tasksApi, TaskType, UpdateTaskPayloadType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskStateType = {};

export const setTasksThunk = createAsyncThunk('tasks/setTasks', (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    return tasksApi.getTasks(todolistId)
        .then(res => {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return {todolistId: todolistId, tasks: res.data.items};
        });
});

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todoListId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    thunkAPI.dispatch(changeTodolistEntityStatusAC({id: param.todoListId, status: 'loading'}));
    thunkAPI.dispatch(changeTaskEntityStatus({todoListId: param.todoListId, status: "loading", taskId: param.taskId}));
    try {
        const res = await tasksApi.deleteTask(param.todoListId, param.taskId);
        if (res.data.resultCode === 0) {
            // thunkAPI.dispatch(removeTaskAC({taskId: param.taskId, todoListId: param.todoListId}));
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            thunkAPI.dispatch(changeTodolistEntityStatusAC({id: param.todoListId, status: 'succeeded'}));
            thunkAPI.dispatch(changeTaskEntityStatus({
                todoListId: param.todoListId,
                taskId: param.taskId,
                status: 'succeeded'
            }));
            return {taskId: param.taskId, todoListId: param.todoListId};
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(error);
    }

    // .catch(error => {
    //     handleServerNetworkError(error, thunkAPI.dispatch);
    // });
});


// export const removeTaskTC_ = (taskId: string, todoListId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}));
//     dispatch(changeTodolistEntityStatusAC({id: todoListId, status: 'loading'}));
//     dispatch(changeTaskEntityStatus({todoListId, status: "loading", taskId}));
//     tasksApi.deleteTask(todoListId, taskId)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(removeTaskAC({taskId, todoListId}));
//                 dispatch(setAppStatusAC({status: 'succeeded'}));
//                 dispatch(changeTodolistEntityStatusAC({id: todoListId, status: 'succeeded'}));
//                 dispatch(changeTaskEntityStatus({todoListId, taskId, status: 'succeeded'}));
//             }
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch);
//         });
// }

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        // removeTaskAC(state, action: PayloadAction<{ taskId: string, todoListId: string }>) {
        //     let tasks = state[action.payload.todoListId];
        //     let index = tasks.findIndex(t => t.id === action.payload.taskId);
        //     if (index > -1) {
        //         tasks.splice(index, 1);
        //     }
        // },
        changeTaskEntityStatus(state, action: PayloadAction<{ todoListId: string, taskId: string, status: RequestStatusType }>) {
            let tasks = state[action.payload.todoListId];
            let index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].entityStatus = action.payload.status;
            }
        },
        addTaskAC(state, action: PayloadAction<{ todoListId: string, task: TaskType }>) {
            let tasks = state[action.payload.task.todoListId];
            tasks.unshift({...action.payload.task, entityStatus: 'idle'});
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskType, todoListId: string }>) {
            let tasks = state[action.payload.todoListId];
            let index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
                state[action.payload.todoList.id] = [];
            }
        );
        builder.addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.todolistId];
            }
        );
        builder.addCase(setTodolistsAC, (state, action) => {
                action.payload.todolists.map(tl => state[tl.id] = []);
            }
        );
        builder.addCase(setTasksThunk.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map((task: any) => ({
                    ...task,
                    entityStatus: 'idle'
                }))
            }
        );
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
                let tasks = state[action.meta.arg.todoListId];
                if (tasks) {
                    let index = tasks.findIndex(t => t.id === action.meta.arg.taskId);
                    if (index > -1) {
                        tasks.splice(index, 1);
                    }
                }
            }
        );
    }
});

//actions
export const {addTaskAC, changeTaskEntityStatus, updateTaskAC} = slice.actions;
//reducer
export const tasksReducer = slice.reducer;

//thunks

export const addTaskTC = (title: string, todoListId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    tasksApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === ResultCodeStatuses.success) {
                let task = res.data.data.item;
                dispatch(addTaskAC({todoListId, task}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch);
        });
}

// export const removeTaskTC = (taskId: string, todoListId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}));
//     dispatch(changeTodolistEntityStatusAC({id: todoListId, status: 'loading'}));
//     dispatch(changeTaskEntityStatus({todoListId, status: "loading", taskId}));
//     tasksApi.deleteTask(todoListId, taskId)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(removeTaskAC({taskId, todoListId}));
//                 dispatch(setAppStatusAC({status: 'succeeded'}));
//                 dispatch(changeTodolistEntityStatusAC({id: todoListId, status: 'succeeded'}));
//                 dispatch(changeTaskEntityStatus({todoListId, taskId, status: 'succeeded'}));
//             }
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch);
//         });
// }

export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTaskEntityStatus({status: "loading", taskId, todoListId: todolistId}));
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
            const action = updateTaskAC({todoListId: todolistId, taskId, model: domainModel});
            dispatch(action);
            dispatch(setAppStatusAC({status: 'succeeded'}));
            dispatch(changeTaskEntityStatus({taskId, todoListId: todolistId, status: 'succeeded'}));
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


export type ActionType =
    ReturnType<typeof addTaskAC>
    // | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    // | AddTodolistACType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsACType
    // | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskEntityStatus>

