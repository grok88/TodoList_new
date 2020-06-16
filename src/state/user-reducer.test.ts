import {userReducer} from './user-reducer';

test('user reducer should increment only age', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };
    const endState = userReducer(startState, { type: 'INCREMENT-AGE' });

    expect(endState.age).toBe(21);
    expect(endState.childrenCount).toBe(2);
});

test('user reducer should increment only childrenCount', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };
    const endTest = userReducer(startState, { type:"INCREMENT-CHILDREN-COUNT"});
    // your code here
    expect(endTest.childrenCount).toBe(3);
    expect(endTest.age).toBe(20);
});

test('user reducer should change name of user', () => {
    const startState = { name: 'Dimych', age: 20, childrenCount: 2 };
    const newName = 'Viktor';
    const endState = userReducer(startState, { type: 'CHANGE-NAME', newName: newName });

    expect(endState.name).toBe(newName);
    expect(endState.childrenCount).toBe(2);
    expect(endState.age).toBe(20);
});
