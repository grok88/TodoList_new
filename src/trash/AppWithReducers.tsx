import React, {useReducer} from 'react';
import '../app/App.css';
import {TodoList} from "../features/TodolistsList/Todolist/TodoList";
import {v1} from 'uuid'
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "../state/todolists-reducer";
import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from "../state/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../api/tasks-api";

export type FilterValueType = "all" | "active" | "completed";

function AppWithReducers() {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, dispatchToTodoLists] = useReducer(todolistsReducer, [
        {id: todoListId1, title: 'What to learn', filter: 'all', order: 0, addedDate: ''},
        {id: todoListId2, title: 'What to buy', filter: 'all', order: 0, addedDate: ''},
    ]);

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoListId1]: [
            {
                id: v1(),
                title: "CSS",
                status: TaskStatuses.Completed,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: v1(), title: "REACT", status: TaskStatuses.New,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: v1(), title: "Rest Api", status: TaskStatuses.New,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
        ],
        [todoListId2]: [
            {
                id: v1(), title: "Milk", status: TaskStatuses.Completed,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: v1(), title: "apple", status: TaskStatuses.Completed,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: v1(), title: "Beer", status: TaskStatuses.New,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },

        ],
    });


    // изменение чекбокса таски
    const changeStatus = (id: string, status: TaskStatuses, todoListId: string) => {
        const action = updateTaskAC(id, {status}, todoListId);
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
        const action = updateTaskAC(id, {title}, todoListId);
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

        const action = addTaskAC(title, {
            title,
            id: '23',
            status: TaskStatuses.New,
            addedDate: '',
            deadline: '',
            description: '',
            order: 0,
            priority: TaskPriorities.low,
            startDate: '',
            todoListId: todoListId
        });
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
        const action = addTodolistAC({
            title,
            id: v1(),
            order: 0,
            addedDate: ''
        });
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
                                taskForTodoList = taskForTodoList.filter((task) => task.status === TaskStatuses.New);
                            }
                            if (tl.filter === 'completed') {
                                taskForTodoList = taskForTodoList.filter((task) => task.status === TaskStatuses.Completed);
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

