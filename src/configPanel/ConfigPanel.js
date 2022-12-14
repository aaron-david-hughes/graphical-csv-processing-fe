import React from 'react';
import Collapsible from "../generalPurposeComponents/collapsible/Collapsible";
import AddNodeController from "../graphController/AddNodeController";
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
            className='lowScreenWidthEnlargeWidth'
        >
            <Collapsible
                title='Nodes'
                id='nodeAndEdgeEditingCollapsible'
                style={{
                    marginBottom: '1rem'
                }}
            >
                <AddNodeController
                    config={this.props.config}
                    addNode={this.props.addNode}
                    addFile={this.props.addFile}
                    graphData={this.props.graphData}
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
                    graphData={this.props.graphData}
                    isGraphValid={this.props.isGraphValid}
                    loading={this.props.loading}
                    isLoading={this.props.isLoading}
                />
            </Collapsible>
        </div>;
    }
}

export default ConfigPanel;