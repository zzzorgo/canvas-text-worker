import * as React from 'react';
import './App.css';

import { CanvasContainer } from './canvas/CanvasContainer';

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <CanvasContainer />
            </div>
        );
    }
}

export default App;
