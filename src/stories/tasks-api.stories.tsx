import React, {useEffect, useState} from 'react'
import {todolistsApi} from "../api/todolists-api";
import {tasksApi, UpdateTaskPayloadType} from "../api/tasks-api";

export default {
    title: 'TasksAPI'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';
        tasksApi.getTasks(todolistId)
            .then(res => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';
        tasksApi.createTask(todolistId, 'My first tasks')
            .then(res => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'ad1470ce-8cfe-4d4c-a653-017d5ad88511';
        const taskId = 'a06282bb-67d8-445e-a974-fb214f84d8f6';
        tasksApi.deleteTask(todolistId, taskId)
            .then(res => {
                debugger
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
            completed: true,
            deadline: null,
            description: 'This task is important',
            priority: 1,
            startDate: null,
            status: 322
        }
        tasksApi.updateTask(todolistId, taskId, payload)
            .then(res => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}