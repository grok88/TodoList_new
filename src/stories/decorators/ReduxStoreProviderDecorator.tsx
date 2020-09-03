import {Provider} from "react-redux";
import store, {AppRootStateType} from "../../state/store";
import React from "react";
import {combineReducers, createStore} from 'redux'
import {v1} from 'uuid'
import {tasksReducer} from "../../state/tasks-reducer";
import {todolistsReducer} from "../../state/todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/tasks-api";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {
            id: "todolistId1", title: "What to learn", filter: "all", addedDate: '',
            order: 0,
            entityStatus:'idle'
        },
        {
            id: "todolistId2", title: "What to buy", filter: "all", addedDate: '',
            order: 0,
            entityStatus:'idle'
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
                startDate: ''
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
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
                startDate: ''
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            }
        ]
    },
    app: {
        status:'idle',
        error: 'er'
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState);


export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
}