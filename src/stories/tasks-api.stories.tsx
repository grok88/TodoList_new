import React, {useEffect, useState} from 'react'
import {todolistsApi} from "../api/todolists-api";
import {tasksApi, UpdateTaskPayloadType} from "../api/tasks-api";

export default {
    title: 'TasksAPI'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('');
    // const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';

    const getTasks = () => {
        tasksApi.getTasks(todolistId)
            .then(res => {
                setState(res.data);
            })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'TodolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>

            <button onClick={getTasks}>get Tasks</button>
        </div>
    </div>
}

// export const CreateTask = () => {
//     const [state, setState] = useState<any>(null)
//     useEffect(() => {
//         const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';
//         tasksApi.createTask(todolistId, 'My first tasks')
//             .then(res => {
//                 setState(res.data);
//             })
//
//     }, [])
//
//     return <div> {JSON.stringify(state)}</div>
// }

export const CreateTask = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    // const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';

    const createTask = () => {
        tasksApi.createTask(todolistId, title)
            .then(res => {
                setState(res.data);
            })
    }
    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'TodolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" placeholder={'Task title'} value={title}
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={createTask}>Create Task</button>
        </div>
    </div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';
        const taskId = 'a06282bb-67d8-445e-a974-fb214f84d8f6';
        tasksApi.deleteTask(todolistId, taskId)
            .then(res => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const updateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';
        const taskId = '58492642-f375-47cc-a7ff-448923eb937e';
        const payload: UpdateTaskPayloadType = {
            title: 'E-HO-HO',
            deadline: '',
            description: 'This task is little',
            priority: 1,
            startDate: '',
            status: 144
        }
        tasksApi.updateTask(todolistId, taskId, payload)
            .then(res => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}