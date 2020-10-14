import {
    changeTodolistEntityStatusAC,
    removeTodolistTC,
    ResultCodeStatuses,
    setTodolistsThunk,
    addTodolistTC,
} from "./todolists-reducer";
import {tasksApi, TaskType, UpdateTaskPayloadType} from "../api/tasks-api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppRootStateType} from "./store";

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
});
export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string, todoListId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    const res = await tasksApi.createTask(param.todoListId, param.title)
    try {
        if (res.data.resultCode === ResultCodeStatuses.success) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return res.data.data.item;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue(null);
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
    }
});
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, todoListId: string, model: UpdateDomainTaskType }, {dispatch, getState, rejectWithValue}) => {
    // так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTaskEntityStatus({status: "loading", taskId: param.taskId, todoListId: param.todoListId}));

    const state = getState() as AppRootStateType;
    const task = state.tasks[param.todoListId].find(t => t.id === param.taskId);

    if (!task) {
        return rejectWithValue('Task not found in state');
    }

    const apiModel: UpdateTaskPayloadType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...param.model
    }

    const res = await tasksApi.updateTask(param.todoListId, param.taskId, apiModel);

    try {
        if (res.data.resultCode === ResultCodeStatuses.success) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            dispatch(changeTaskEntityStatus({taskId: param.taskId, todoListId: param.todoListId, status: 'succeeded'}));
            // return {todoListId: param.todolistId, taskId: param.taskId, model: param.domainModel};
            return param;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }

    } catch (error) {
        handleServerNetworkError(error.data, dispatch);
        return rejectWithValue(null);
    }

});

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        changeTaskEntityStatus(state, action: PayloadAction<{ todoListId: string, taskId: string, status: RequestStatusType }>) {
            let tasks = state[action.payload.todoListId];
            let index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].entityStatus = action.payload.status;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
                state[action.payload.todoList.id] = [];
            }
        );
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
                if (action.payload) {
                    delete state[action.payload.todolistId];
                }
            }
        );
        builder.addCase(setTodolistsThunk.fulfilled, (state, action) => {
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
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
                let tasks = state[action.payload.todoListId];
                tasks.unshift({...action.payload, entityStatus: 'idle'});
            }
        );
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
                let tasks = state[action.payload.todoListId];
                let index = tasks.findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            }
        );
    }
});

//actions
export const {changeTaskEntityStatus} = slice.actions;
//reducer
export const tasksReducer = slice.reducer;

//thunks

// export const addTaskTC = (title: string, todoListId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}));
//     tasksApi.createTask(todoListId, title)
//         .then(res => {
//             if (res.data.resultCode === ResultCodeStatuses.success) {
//                 let task = res.data.data.item;
//                 dispatch(addTaskAC({todoListId, task}));
//                 dispatch(setAppStatusAC({status: 'succeeded'}));
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch);
//         });
// }

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

// export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
//
// // так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// // те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва
//     dispatch(setAppStatusAC({status: 'loading'}));
//     dispatch(changeTaskEntityStatus({status: "loading", taskId, todoListId: todolistId}));
//     const task = getState().tasks[todolistId].find(t => t.id === taskId)
//     if (!task) {
//         console.warn('Task not found in state');
//         return;
//     }
//     const apiModel: UpdateTaskPayloadType = {
//         title: task.title,
//         startDate: task.startDate,
//         priority: task.priority,
//         description: task.description,
//         deadline: task.deadline,
//         status: task.status,
//         ...domainModel
//     }
//
//     tasksApi.updateTask(todolistId, taskId, apiModel).then((res) => {
//         if (res.data.resultCode === ResultCodeStatuses.success) {
//             const action = updateTaskAC({todoListId: todolistId, taskId, model: domainModel});
//             dispatch(action);
//             dispatch(setAppStatusAC({status: 'succeeded'}));
//             dispatch(changeTaskEntityStatus({taskId, todoListId: todolistId, status: 'succeeded'}));
//         } else {
//             handleServerAppError(res.data, dispatch);
//         }
//     })
//         .catch(error => {
//             handleServerNetworkError(error.data, dispatch);
//         })
//
// }

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
// ReturnType<typeof addTaskAC>
// | ReturnType<typeof removeTaskAC>
//     | ReturnType<typeof updateTaskAC>
// | AddTodolistACType
//     | AddTodolistActionType
    // | RemoveTodolistActionType
    // | SetTodolistsACType
    // | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskEntityStatus>

