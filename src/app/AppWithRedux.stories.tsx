import React from 'react';
import AppWithRedux from './AppWithRedux';
import {ReduxStoreProviderDecorator, BrowserRouterDecorator} from '../stories/decorators/ReduxStoreProviderDecorator';

export default {
    title: 'AppWithRedux',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator,BrowserRouterDecorator]
};

export const AppWithReduxBaseExample = (props: any) => {
    return <AppWithRedux/>
}