import axios from 'axios'

export type TodolistType = {
    id: string;
    addedDate: string;
    order: number;
    title: string;
}

// type CreateTodolistRespType = {
//     resultCode: number;
//     messages: Array<string>;
//     data: {
//         item: TodolistType
//     }
// }
// type CommonRespType1 = {
//     resultCode: number;
//     messages: Array<string>;
//     data: {}
// }

type CommonRespType<T = {}> = {
    data: T
    resultCode: number;
    messages: Array<string>;

}

type GetTasksRespType = {
    error: null | string;
    totalCount: number;
    items: TaskType[]
}

type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'd957613d-94bb-4388-aef0-47e775e83ac5'
    }
});

export const todolistsApi = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<CommonRespType<{ item: TodolistType }>>('todo-lists', {title});
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<CommonRespType>(`todo-lists/${todolistId}`)
    },
    updateTodolistTitle(todolistId: string, title: string) {
        return instance.put<CommonRespType>(`todo-lists/${todolistId}`, {title})
    }
}

export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksRespType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId:string, title:string){
        return instance.post(`todo-lists/${todolistId}/tasks`, {title})
    }
}