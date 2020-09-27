import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";
import thunkMiddleware from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import logger from "redux-logger";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
});

// const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
            .prepend(
                // correctly typed middlewares can just be used
                thunkMiddleware,
            )
})
// @ts-ignore
window.store = store;

export type AppRootStateType = ReturnType<typeof rootReducer>
export default store;