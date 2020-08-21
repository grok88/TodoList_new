import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'd957613d-94bb-4388-aef0-47e775e83ac5'
    }
});

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

type GetTasksRespType = {
    error: null | string;
    totalCount: number;
    items: TaskType[];
}
// type CreateTaskRespType = {
//     messages: Array<string>;
//     resultCode: number;
//     data: {
//         item: TaskType;
//     }
// }
// type DeleteTaskRespType = {
//     messages: Array<string>;
//     resultCode: number;
//     data: {};
// }
type UpdateTaskRespType = {
    messages: Array<string>;
    resultCode: number;
    data: {
        item: TaskType;
    };
}

type CommonTaskRespType<T = {}> = {
    messages: Array<string>;
    resultCode: number;
    data: T;
}

export type UpdateTaskPayloadType = {
    title: string;
    description: string;
    completed: boolean;
    status: number;
    priority: number;
    startDate: string | null;
    deadline: string | null;
}

export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksRespType>(`todo-lists/${todolistId}/tasks`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<CommonTaskRespType<{ item: TaskType; }>>(`todo-lists/${todolistId}/tasks`, {title});
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<CommonTaskRespType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    updateTask(todolistId: string, taskId: string, payload: UpdateTaskPayloadType) {
        return instance.put<CommonTaskRespType<{ item: TaskType; }>>(`todo-lists/${todolistId}/tasks/${taskId}`, payload);
    }
}