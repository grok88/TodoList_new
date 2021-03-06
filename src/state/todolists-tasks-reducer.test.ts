import {addTodolistTC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {tasksReducer, TaskStateType} from "./tasks-reducer";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let todoList = {
        title: 'new todolist',
        id: 'ryy',
        order: 0,
        addedDate: ''
    }
    const action = addTodolistTC.fulfilled({todoList}, 'requestId', todoList.title);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodolists).toBe(action.payload.todoList.id);
});

// test('ids should be undefined', () => {
//     const startTasksState: TaskStateType = {
//         "todolistId2": [
//             { id: "1", title: "bread", isDone: false },
//             { id: "2", title: "milk", isDone: true },
//             { id: "3", title: "tea", isDone: false }
//         ]
//     };
//     const startTodolistsState: Array<TodoList> = [
//         {id: "todolistId2", title: "What to buy", filter: "all"}
//     ];
//
//     const action = removeTodolistAC("todolistId2");
//
//     const endTasksState = tasksReducer(startTasksState, action)
//     const endTodolistsState = todolistsReducer(startTodolistsState, action)
//
//     const keys = Object.keys(endTasksState);
//     const idFromTasks = keys[0];
//     const todolist = endTodolistsState[0];
//
//     expect(idFromTasks).toBeUndefined();
//     expect(todolist).toBeUndefined();
// });

