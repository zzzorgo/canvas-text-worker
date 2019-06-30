import * as React from 'react';
import './App.css';

import { ConnectedMarkerHighlight } from './marker/MarkerHihghlight';
// import { MarkerWordparts } from './marker/MarkerWordpats';

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <ConnectedMarkerHighlight />
                {/* <MarkerWordparts /> */}

            </div>
        );
    }
}

export default App;
