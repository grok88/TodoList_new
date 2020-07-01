import React, {useReducer} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from 'uuid'
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTitleStatusAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

export type FilterValueType = "all" | "active" | "completed";

export type TodoList = {
    id: string;
    title: string;
    filter: FilterValueType;
}

// export type TaskStateType = {
//     [key: string]: Array<TaskType>;
// }

function AppWithReducers() {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, dispatchToTodoLists] = useReducer(todolistsReducer, [
        {id: todoListId1, title: 'What to learn', filter: 'all'},
        {id: todoListId2, title: 'What to buy', filter: 'all'},
    ]);

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoListId1]: [
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "REACT", isDone: false},
            {id: v1(), title: "Rest Api", isDone: false},
        ],
        [todoListId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "apple", isDone: true},
            {id: v1(), title: "Beer", isDone: false},

        ],
    });


    // изменение чекбокса таски
    const changeStatus = (id: string, isDone: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(id, isDone, todoListId);
        dispatchToTasks(action);
        // let todoTasks = tasks[todoListId];
        // let task = todoTasks.find(elem => elem.id === id);
        // if (task) {
        //     task.isDone = isDone;
        //     setTasks({...tasks});
        // }
    }


    // Изменение тайтла таски
    const changeTitle = (id: string, todoListId: string, title: string) => {
        const action = changeTitleStatusAC(id, title, todoListId);
        dispatchToTasks(action);
        // let todoTasks = tasks[todoListId];
        // let task = todoTasks.find(elem => elem.id === id);
        // if (task) {
        //     task.title = title;
        //     setTasks({
        //         ...tasks
        //     });
        // }
    }


    // Удаление тасок
    const removeTask = (id: string, todoListId: string) => {
        const action = removeTaskAC(id, todoListId);
        dispatchToTasks(action);
        // let todoList = tasks[todoListId];
        // tasks[todoListId] = todoList.filter((task) => task.id !== id);
        // setTasks({...tasks});
    }

    // Добавление таски
    const addTask = (title: string, todoListId: string) => {
        const action = addTaskAC(title, todoListId);
        dispatchToTasks(action);
        // let task = {id: v1(), title, isDone: false};
        // let todoList = tasks[todoListId];
        // tasks[todoListId] = [task, ...todoList];
        // setTasks({...tasks});
    }

    const changeFilter = (value: FilterValueType, todoListId: string) => {
        const action = changeTodolistFilterAC(todoListId, value);
        dispatchToTodoLists(action);
        // let todoList = todoLists.find(elem => elem.id === todoListId);
        // if (todoList) {
        //     todoList.filter = value;
        // }
        // setTodoLists([...todoLists]);
    }
    // Изменение тайтла todoList
    const changeTitleTodoList = (todoListId: string, title: string) => {
        const action = changeTodolistTitleAC(todoListId, title);
        dispatchToTodoLists(action);
        // const todoList = todoLists.find(tl => tl.id === todoListId);
        // if (todoList) {
        //     todoList.title = title;
        // }
        // setTodoLists([...todoLists]);
    }
    // Удаление таски-листа
    const removeTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId);
        dispatchToTodoLists(action);
        dispatchToTasks(action)

        // const action = removeTodolistAC(todoListId);
        // dispatchToTodoLists(action);
        // let deleteTodoList = todoLists.filter(elem => elem.id !== todoListId);
        // setTodoLists(deleteTodoList);
        // delete tasks[todoListId];
        // setTasks({...tasks});
    }
    // Добавление таски
    const addTodoList = (title: string) => {
        const action = addTodolistAC(title);
        dispatchToTodoLists(action);
        dispatchToTasks(action)

        // let todoList: TodoList = {
        //     id: v1(),
        //     title,
        //     filter: 'all'
        // }
        // setTodoLists([todoList, ...todoLists]);
        // setTasks({
        //     ...tasks,
        //     [todoList.id]: []
        // });
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "10px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map((tl) => {

                            let taskForTodoList = tasks[tl.id];
                            if (tl.filter === 'active') {
                                taskForTodoList = taskForTodoList.filter((task) => task.isDone === false);
                            }
                            if (tl.filter === 'completed') {
                                taskForTodoList = taskForTodoList.filter((task) => task.isDone === true);
                            }

                            return (
                                <Grid item key={tl.id}>
                                    <Paper style={{padding: "10px"}} elevation={3}>
                                        <TodoList
                                            title={tl.title}
                                            id={tl.id}
                                            filter={tl.filter}
                                            tasks={taskForTodoList}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeStatus={changeStatus}
                                            removeTodoList={removeTodoList}
                                            changeTitle={changeTitle}
                                            changeTitleTodoList={changeTitleTodoList}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducers;

