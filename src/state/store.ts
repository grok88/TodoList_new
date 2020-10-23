import {combineReducers} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";
import thunkMiddleware from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
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
});

export type RootReducerType = typeof rootReducer;

// @ts-ignore
window.store = store;

export type AppRootStateType = ReturnType<RootReducerType>;
type AppDispatchType = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatchType>()
export default store;