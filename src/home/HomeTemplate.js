import Graph from '../graph/Graph'
import ConfigPanel from '../configPanel/ConfigPanel';
import Switch from "../generalPurposeComponents/switch/Switch";
import Popup from "../generalPurposeComponents/popup/Popup";
import React from "react";

function render(props, state) {
    return <div
        style={{
            height: '100%',
            width: '100%'
        }}
    >
        <div className='header'>
            <h1 className='title'>CSV Processor</h1>
            <button
                style={{
                    border: 'none',
                    margin: '1rem'
                }}
                onClick={props.openSettings}
                title='Settings'
            >
                <i
                    className='fa fa-cogs'
                    style={{
                        fontSize: '36px',
                        color: 'darkslategray'
                    }}
                />
            </button>
        </div>

        <div
            id='mainContent'
            style={{
                width: '100%',
                height: '80%',
                display: 'inline-flex'
            }}
        >
            <div id='graph'
                 style={{
                     border: '2px solid darkslategray',
                     borderRadius: '10px',
                     margin: '1rem',
                     width: '75%'
                 }}
            >
                <Graph graphData={state.graphData}/>
            </div>

            <ConfigPanel
                id='control'
                style={{
                    width: '25%',
                    display: 'block',
                    margin: '1rem'
                }}
                graphData={state.graphData}
                onSubmitForm={props.onSubmitForm}
                addFile={props.addFile}
                addNode={props.addNode}
                addEdge={props.addEdge}
            />
        </div>

        <div id='saveLoad'>
            <button className='freeButton'>Save Graph</button>
            <button className='freeButton'>Save Graph with Config</button>
            <button className='freeButton'>Load Graph</button>
        </div>

        <Popup
            id='settingsPopup'
            title='Settings'
            isOpen={state.isSettings}
            close={props.closeSettings}
            width='30%'
            height='30%'
        >
            <p>hello</p>
            <br />
            <p>world!</p>
            {/*<Switch*/}
            {/*    id='isCSC1026'*/}
            {/*    graphData={state.graphData}*/}
            {/*    isChecked={state.isCSC1026}*/}
            {/*    onChange={props.toggleIsCSC1026}*/}
            {/*    title={state.switchTitle}*/}
            {/*/>*/}
        </Popup>
    </div>
}

//put form in the id=control section -> then test the click event listener for graph
export default render;