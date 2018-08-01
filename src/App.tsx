import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import { sum } from './utils';

class App extends React.Component {
    public render() {
        const result = sum(3, 5);

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">{`Welcome to React (${result})`}</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
            </div>
        );
    }
}

export default App;
