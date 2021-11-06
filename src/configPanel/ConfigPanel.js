import React from 'react';
import Collapsible from "../generalPurposeComponents/collapsible/Collapsible";
import ConfigureForm from "../configureForm/ConfigureForm";

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
                title='test collapsible component'
                id='nodeAndEdgeEditingCollapsible'
                style={{
                    marginBottom: '1rem'
                }}
            >
                <p>this is simply a test</p>
            </Collapsible>

            <Collapsible
                title='test collapsible component 2'
                id='nodeConfigurationCollapsible'
            >
                <ConfigureForm
                    graphData={this.props.graphData}
                    nodeFileName={this.props.nodeFileName}
                    onSubmitForm={this.props.onSubmitForm}
                />
            </Collapsible>
        </div>;
    }
}

export default ConfigPanel;