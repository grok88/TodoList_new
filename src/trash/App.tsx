import React, {useState} from 'react';
import '../app/App.css';
import {TodoList} from "../features/TodolistsList/Todolist/TodoList";
import {v1} from 'uuid'
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {TaskPriorities, TaskStatuses, TaskType} from "../api/tasks-api";
import {TodolistDomainType} from "../state/todolists-reducer";
import {TaskStateType, TaskDomainType} from "../state/tasks-reducer";

export type FilterValueType = "all" | "active" | "completed";



function App() {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, setTodoLists] = useState<Array<TodolistDomainType>>([
        {id: todoListId1, title: 'What to learn', filter: 'all', order: 0, addedDate: '',entityStatus:'idle'},
        {id: todoListId2, title: 'What to buy', filter: 'all', order: 0, addedDate: '', entityStatus:'idle'},
    ]);

    let [tasks, setTasks] = useState<TaskStateType>({
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
                entityStatus:'idle'
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.Completed,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus:'idle'
            },
            {
                id: v1(),
                title: "REACT",
                status: TaskStatuses.New,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus:'idle'
            },
            {
                id: v1(),
                title: "Rest Api",
                status: TaskStatuses.New,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus:'idle'
            },
        ],
        [todoListId2]: [
            {
                id: v1(),
                title: "Milk",
                status: TaskStatuses.Completed,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus:'idle'
            },
            {
                id: v1(),
                title: "apple",
                status: TaskStatuses.Completed,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus:'idle'
            },
            {
                id: v1(),
                title: "Beer",
                status: TaskStatuses.New,
                todoListId: todoListId1,
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: '',
                entityStatus:'idle'
            },
        ],
    });


    // изменение чекбокса таски
    const changeStatus = (id: string, status: TaskStatuses, todoListId: string) => {
        let todoTasks = tasks[todoListId];
        let task = todoTasks.find(elem => elem.id === id);
        if (task) {
            task.status = status;
            setTasks({...tasks});
        }
    }


    // Изменение тайтла таски
    const changeTitle = (id: string, todoListId: string, title: string) => {
        let todoTasks = tasks[todoListId];
        let task = todoTasks.find(elem => elem.id === id);
        if (task) {
            task.title = title;
            setTasks({
                ...tasks
            });
        }
    }


    // Удаление тасок
    const removeTask = (id: string, todoListId: string) => {
        let todoList = tasks[todoListId];
        tasks[todoListId] = todoList.filter((task) => task.id !== id);
        setTasks({...tasks});
    }

    // Добавление таски
    const addTask = (title: string, todoListId: string) => {
        let task:TaskDomainType = {
            id: v1(),
            title,
            status: TaskStatuses.Completed,
            todoListId: todoListId,
            priority: TaskPriorities.low,
            addedDate: '',
            deadline: '',
            description: '',
            order: 0,
            startDate: '',
            entityStatus:'idle'
        };
        let todoList = tasks[todoListId];
        tasks[todoListId] = [task, ...todoList];
        setTasks({...tasks});
    }

    const changeFilter = (value: FilterValueType, todoListId: string) => {
        let todoList = todoLists.find(elem => elem.id === todoListId);
        if (todoList) {
            todoList.filter = value;
        }
        setTodoLists([...todoLists]);
    }
    // Изменение тайтла todoList
    const changeTitleTodoList = (todoListId: string, title: string) => {
        const todoList = todoLists.find(tl => tl.id === todoListId);
        if (todoList) {
            todoList.title = title;
        }
        setTodoLists([...todoLists]);
    }
    // Удаление таски-листа
    const removeTodoList = (todoListId: string) => {
        let deleteTodoList = todoLists.filter(elem => elem.id !== todoListId);
        setTodoLists(deleteTodoList);
        delete tasks[todoListId];
        setTasks({...tasks});
    }
    // Добавление таски
    const addTodoList = async(title: string) => {
        let todoList: TodolistDomainType = {
            id: v1(),
            title,
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus:'idle'
        }
        setTodoLists([todoList, ...todoLists]);
        setTasks({
            ...tasks,
            [todoList.id]: []
        });
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
                                            entityStatus={tl.entityStatus}
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

export default App;

