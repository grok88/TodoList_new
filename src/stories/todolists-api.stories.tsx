import React, {useEffect, useState} from 'react'
import {todolistsApi} from "../api/todolists-api";
import {tasksApi} from "../api/tasks-api";

export default {
    title: 'TodolistsAPI'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
        todolistsApi.getTodolists()
            .then(res => {

                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.createTodolist('Grok list is big')
            .then(res => {

                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'ce34b90f-9495-4831-a438-122713512fbd';
        todolistsApi.deleteTodolist(todolistId)
            .then(res => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '484255cb-8861-494b-8e9b-23feeebd297c';
        todolistsApi.updateTodolistTitle(todolistId, 'test title')
            .then(res => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


