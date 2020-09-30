import {appReducer, RequestStatusType, setAppErrorAC, setAppStatusAC, setIsInitializedAC} from "./app-reducer";
// import {TaskStateType} from '../trash/App';

type StartStateType = {
    status: RequestStatusType;
    error: string | null;
    isInitialized: boolean;
}

let startState: StartStateType;

beforeEach(() => {
    startState = {
        status: 'idle',
        error: null,
        isInitialized: false
    };
})

test('correct status should be set', () => {

    const action = setAppStatusAC({status: 'loading'});

    const endState = appReducer(startState, action)

    expect(endState.status).toBe('loading');
});

test('correct error should be set ', () => {

    const action = setAppErrorAC({error: 'Some BIG error'});

    const endState = appReducer(startState, action)

    expect(endState.error).toBe('Some BIG error');
});
test('isInitialized should be changed', () => {

    const action = setIsInitializedAC({isInitialized:true});

    const endState = appReducer(startState, action)

    expect(endState.isInitialized).toBe(true);
});
