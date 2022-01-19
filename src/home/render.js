import Graph from '../graph/Graph'
import ConfigPanel from '../configPanel/ConfigPanel';
import Popup from "../generalPurposeComponents/popup/Popup";
import Banner from "../generalPurposeComponents/banner/Banner";
import React from "react";
import EditNodeController from "../graphController/EditNodeController";
import Input from "../generalPurposeComponents/input/Input";

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
                    addEdge={props.addEdge}
                    setEditNode={props.setEditNode}
                    deleteEdge={props.deleteEdge}
                    addBanner={props.addBanner}
                    invalidNodes={state.invalidNodes}
                    invalidNodeCardinalities={state.invalidNodeCardinalities}
                />

                <div id='graphButtons'
                     style={{width: '100%', display: 'inline-flex'}}
                >
                    <div
                        style={{width: '50%', display: 'flex', justifyContent: 'left'}}
                    >
                        <button
                            className='freeButton'
                            id='saveButton'
                            title='Save Graph'
                            onClick={props.switchSavePopup}
                        >
                            save graph
                        </button>
                        <button
                            className='freeButton'
                            id='loadButton'
                            title='Load Graph'
                            onClick={props.switchLoadPopup}
                        >
                            load graph
                        </button>
                    </div>

                    <div
                        style={{width: '50%', display: 'flex', justifyContent: 'right'}}
                    >
                        <button
                            className='freeButton'
                            id='clearButton'
                            title='Clear Graph'
                            onClick={props.clearGraph}
                        >
                            clear graph
                        </button>
                    </div>
                </div>
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
                addBanner={props.addBanner}
                isGraphValid={props.isGraphValid}
            />
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

        {
            state.savePopup ?
                <Popup
                    id='savePopup'
                    title='Save Graph'
                    isOpen={true}
                    close={props.switchSavePopup}
                    width='35%'
                    height='35%'
                >
                    {
                        !props.isGraphValid()
                            ? <p className='ow' style={{color: 'red'}}>
                                <i className='fa fa-info-circle'/>
                                {` You cannot save an invalid graph`}
                            </p>
                            : null
                    }
                    <div
                        style={{
                            width: '100%'
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                display: 'inline-flex'
                            }}
                        >
                            <Input
                                title='Graph Save Name'
                                style={{width: '100%'}}
                                input={
                                    <input
                                        id='graphSaveFilename'
                                        disabled={!props.isGraphValid()}
                                        type='text'
                                        onChange={e => props.setSaveGraphFilename(e.target.value)}
                                    />
                                }
                            />
                        </div>
                        <div style={{margin: '5px'}}>
                            <p className='ow'>
                                <i className='fa fa-info-circle'/>
                                {` Using filename: ${state.saveGraphFilename}`}
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'inline-flex',
                            width: '100%',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        <button
                            id='saveWithConfigButton'
                            title='Save with Config'
                            disabled={!props.isGraphValid()}
                            onClick={e => {
                                e.preventDefault();
                                props.saveGraphWithConfig(state.saveGraphFilename);
                            }}
                            style={{
                                width: '30%'
                            }}
                        >
                            <strong><h4 style={{textDecoration: 'underline'}}>Save with Config</h4></strong>
                            <p>Saves each nodes configuration as it stands, along with the files supplied.</p>
                        </button>
                        <button
                            id='saveConfigTemplateButton'
                            title='Save Config Template'
                            disabled={!props.isGraphValid()}
                            onClick={e => {
                                e.preventDefault();
                                props.saveGraphConfigTemplate(state.saveGraphFilename);
                            }}
                            style={{
                                width: '30%'
                            }}
                        >
                            <strong><h4 style={{textDecoration: 'underline'}}>Save Config Template</h4></strong>
                            <p>Saves all but input files, enabling for template ease of use for repetitive processes.</p>
                        </button>
                        <button
                            id='saveTemplateButton'
                            title='Save Template'
                            disabled={!props.isGraphValid()}
                            onClick={e => {
                                e.preventDefault();
                                props.saveGraphTemplate(state.saveGraphFilename);
                            }}
                            style={{
                                width: '30%'
                            }}
                        >
                            <strong><h4 style={{textDecoration: 'underline'}}>Save Template</h4></strong>
                            <p>Saves the layout of nodes and edges, without node configuration.</p>
                        </button>
                    </div>
                </Popup>
                : null
        }

        {
            state.loadPopup ?
                <Popup
                    id='loadPopup'
                    title='Load Graph'
                    isOpen={true}
                    close={props.switchLoadPopup}
                    width='35%'
                    height='35%'
                >
                    <input
                        id='loadGraphFileInput'
                        type='file'
                        accept='application/json'
                        onChange={e => {
                            e.preventDefault();
                            props.loadGraph(e);
                        }}
                    />
                </Popup>
                : null
        }

        {
            state.editingNode ?
                <Popup
                    id='editNodePopup'
                    title='Edit Node'
                    isOpen={true}
                    close={props.unsetEditNode}
                    width='35%'
                    height='35%'
                >
                    <EditNodeController
                        graphData={state.graphData}
                        config={state.config}
                        editNode={props.editNode}
                        deleteNode={props.deleteNode}
                        close={props.unsetEditNode}
                        addFile={props.addFile}
                        removeFile={props.removeFile}
                        addBanner={props.addBanner}
                        node={state.editingNode}
                        invalidNodes={state.invalidNodes}
                        setValidNode={props.setValidNode}
                    />
                </Popup>
                : null
        }
    </div>
}

export default render;