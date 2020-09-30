import {Provider} from "react-redux";
import {AppRootStateType, RootReducerType} from "../../state/store";
import React from "react";
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {v1} from 'uuid'
import {tasksReducer} from "../../state/tasks-reducer";
import {todolistsReducer} from "../../state/todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/tasks-api";
import {appReducer} from "../../state/app-reducer";
import {authReducer} from "../../features/Login/auth-reducer";
import thunkMiddleware from 'redux-thunk';
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {
            id: "todolistId1", title: "What to learn", filter: "all", addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
        {
            id: "todolistId2", title: "What to buy", filter: "all", addedDate: '',
            order: 0,
            entityStatus: 'idle'
        }
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus: 'idle'
            }
        ],
        ["todolistId2"]: [
            {
                id: v1(), title: "Milk", status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus: 'idle'
            }
        ]
    },
    app: {
        status: 'succeeded',
        error: 'Some error',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
};
export const storyBookStore = configureStore({
    reducer:rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
        .prepend(thunkMiddleware),
    preloadedState:initialGlobalState
});
// export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunkMiddleware));


export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
}
export const BrowserRouterDecorator = (storyFn: any) => {
    return <HashRouter>
        {storyFn()}
    </HashRouter>
}