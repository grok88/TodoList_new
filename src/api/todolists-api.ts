import axios from 'axios'

export type TodolistType = {
    id: string;
    addedDate: string;
    order: number;
    title: string;
}

export type FieldErrorType = { field: string, error: string };
export type CommonRespType<T = {}> = {
    data: T
    resultCode: number;
    messages: Array<string>;
    fieldsErrors?: Array<FieldErrorType>
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

export type AuthMeRespType = {
    id: number;
    email: string;
    login: string;
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
export type LoginErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
    captcha?: string
}


export const authAPI = {
    me() {
        return instance.get<CommonRespType<AuthMeRespType>>('auth/me');
    },
    login(data: LoginParamsType) {
        return instance.post<CommonRespType<{ userId?: number }>>('/auth/login', data);
    },
    logout() {
        return instance.delete<CommonRespType>('auth/login');
    }
}

