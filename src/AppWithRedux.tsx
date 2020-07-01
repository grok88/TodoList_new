import React from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTitleStatusAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValueType = "all" | "active" | "completed";

export type TodoList = {
    id: string;
    title: string;
    filter: FilterValueType;
}

export type TaskStateType = {
    [key: string]: Array<TaskType>;
}

function AppWithRedux() {

    let todolists = useSelector<AppRootStateType, Array<TodoList>>(state => state.todolists);
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks);
    let dispatch = useDispatch();


    // изменение чекбокса таски
    const changeStatus = (id: string, isDone: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(id, isDone, todoListId);
        dispatch(action);
    }


    // Изменение тайтла таски
    const changeTitle = (id: string, todoListId: string, title: string) => {
        const action = changeTitleStatusAC(id, title, todoListId);
        dispatch(action);
    }


    // Удаление тасок
    const removeTask = (id: string, todoListId: string) => {
        const action = removeTaskAC(id, todoListId);
        dispatch(action);
    }

    // Добавление таски
    const addTask = (title: string, todoListId: string) => {
        const action = addTaskAC(title, todoListId);
        dispatch(action);
    }

    const changeFilter = (value: FilterValueType, todoListId: string) => {
        const action = changeTodolistFilterAC(todoListId, value);
        dispatch(action);
    }
    // Изменение тайтла todoList
    const changeTitleTodoList = (todoListId: string, title: string) => {
        const action = changeTodolistTitleAC(todoListId, title);
        dispatch(action);
    }
    // Удаление таски-листа
    const removeTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId);
        dispatch(action);
    }
    // Добавление таски
    const addTodoList = (title: string) => {
        const action = addTodolistAC(title);
        dispatch(action);
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
                        todolists.map((tl) => {

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

export default AppWithRedux;

