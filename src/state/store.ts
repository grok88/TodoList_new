import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";
import thunkMiddleware from "redux-thunk";
import {appReducer} from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";

const rootReducer = combineReducers({
    tasks:tasksReducer,
    todolists:todolistsReducer,
    app:appReducer,
    auth:authReducer
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// @ts-ignore
window.store =store;

export type AppRootStateType = ReturnType<typeof rootReducer>
export default store;