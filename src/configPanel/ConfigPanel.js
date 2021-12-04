import React from 'react';
import Collapsible from "../generalPurposeComponents/collapsible/Collapsible";
import GraphController from "../graphController/GraphController";
import ProcessForm from "../processForm/ProcessForm";

class ConfigPanel extends React.Component {
    render() {
        return <div
            id='control'
            style={{
                width: '25%',
                display: 'block',
                margin: '1rem'
            }}
        >
            <Collapsible
                title='Edit Graph'
                id='nodeAndEdgeEditingCollapsible'
                style={{
                    marginBottom: '1rem'
                }}
            >
                <GraphController
                    addNode={this.props.addNode}
                    editNode={this.props.editNode}
                    deleteNode={this.props.deleteNode}
                    addEdge={this.props.addEdge}
                    editEdge={this.props.editEdge}
                    deleteEdge={this.props.deleteEdge}
                    addFile={this.props.addFile}
                    graphData={this.props.graphData}
                    setStep={this.props.setStep}
                    step={this.props.step}
                    editingId={this.props.editingId}
                />
            </Collapsible>

            <Collapsible
                title='Process'
                id='processCollapsible'
                style={{
                    marginBottom: '1rem'
                }}
            >
                {/*will have a file name option which will not be required*/}
                <ProcessForm
                    onSubmitForm={this.props.onSubmitForm}
                />
            </Collapsible>
        </div>;
    }
}

export default ConfigPanel;