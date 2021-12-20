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
                    config={this.props.config}
                    addNode={this.props.addNode}
                    editNode={this.props.editNode}
                    deleteNode={this.props.deleteNode}
                    addFile={this.props.addFile}
                    graphData={this.props.graphData}
                    setStep={this.props.setStep}
                    step={this.props.step}
                    editingId={this.props.editingId}
                    addBanner={this.props.addBanner}
                />
            </Collapsible>

            <Collapsible
                title='Process'
                id='processCollapsible'
                style={{
                    marginBottom: '1rem'
                }}
            >
                <ProcessForm
                    onSubmitForm={this.props.onSubmitForm}
                />
            </Collapsible>
        </div>;
    }
}

export default ConfigPanel;