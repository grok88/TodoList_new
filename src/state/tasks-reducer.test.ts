import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from './tasks-reducer';
import {TaskStateType} from '../App';
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from '../api/tasks-api';

let startState: TaskStateType = {};

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", title: "CSS",
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: "3", title: "React",
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread",
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            },
            {
                id: "3", title: "tea",
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                priority: TaskPriorities.low,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                startDate: ''
            }
        ]
    };
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC( "todolistId2", {
                status: 0,
                todoListId:'todolistId2',
                startDate:'',
                priority:TaskPriorities.low,
                order:0,
                description:'',
                deadline:'',
                addedDate:'',
                id:'7',
                title:'juce'

            });
    //{
    //         status: 0,
    //         todoListId:'',
    //         startDate:'',
    //         priority:TaskPriorities.low,
    //         order:0,
    //         description:'',
    //         deadline:'',
    //         addedDate:'',
    //         id:'todolistId2',
    //         title:'juce'
    //
    //     }
    // "todolistId2"
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {

    const action = updateTaskAC("2", {status: TaskStatuses.New}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBeTruthy();
    expect(endState["todolistId2"][0]).toEqual(startState["todolistId2"][0]);
    expect(endState["todolistId2"][2]).toEqual(startState["todolistId2"][2]);
});
test('title of specified task should be changed', () => {
    const action = updateTaskAC("2", {title: 'newTitle'}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe('newTitle');
    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][0]).toEqual(startState["todolistId2"][0]);
    expect(endState["todolistId2"][2]).toEqual(startState["todolistId2"][2]);
});

test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC({
        addedDate: '',
        order: 0,
        id: 'tyrr',
        title: 'new todolist'
    });

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('propertry with todolistId should be deleted', () => {

    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
