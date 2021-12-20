import Graph from '../graph/Graph'
import ConfigPanel from '../configPanel/ConfigPanel';
// import Switch from "../generalPurposeComponents/switch/Switch";
import Popup from "../generalPurposeComponents/popup/Popup";
import Banner from "../generalPurposeComponents/banner/Banner";
import React from "react";

function render(props, state) {
    return <div
        style={{
            height: '100%',
            width: '100%'
        }}
    >
        <div className='header' style={{backgroundColor: 'lightgray', borderBottom: '2px solid darkslategray'}}>
            <h1 className='title'>CSV Processor</h1>
            <button
                className='headerButton'
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

        <div id='bannerSection' style={{width: '100%', position: 'fixed', zIndex: '1'}}>
            {
                state.banners.map(banner => {
                    return <Banner
                        key={banner.id}
                        id={banner.id}
                        msg={banner.msg}
                        type={banner.type}
                        timeToLive={banner.timeToLive ? banner.timeToLive : '5000'}
                        removeBanner={props.removeBanner}
                    />
                })
            }
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
                <Graph
                    config={state.config}
                    graphData={state.graphData}
                    setStep={props.setStep}
                    addEdge={props.addEdge}
                    deleteEdge={props.deleteEdge}
                    addBanner={props.addBanner}
                />
            </div>

            <ConfigPanel
                id='control'
                style={{
                    width: '25%',
                    display: 'block',
                    margin: '1rem'
                }}
                config={state.config}
                graphData={state.graphData}
                onSubmitForm={props.onSubmitForm}
                addFile={props.addFile}
                addNode={props.addNode}
                editNode={props.editNode}
                deleteNode={props.deleteNode}
                setStep={props.setStep}
                step={state.step}
                editingId={state.editingId}
                addBanner={props.addBanner}
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
        </Popup>
    </div>
}

export default render;