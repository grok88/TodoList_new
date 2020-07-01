import {combineReducers, createStore} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";

const rootReducer = combineReducers({
    tasks:tasksReducer,
    todolists:todolistsReducer
});

const store = createStore(rootReducer);
// @ts-ignore
window.store =store;

export type AppRootStateType = ReturnType<typeof rootReducer>
export default store;