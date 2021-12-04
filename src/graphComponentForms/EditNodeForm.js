import React from 'react';

class EditNodeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.graphData.nodes.find(node => this.props.editingId === node.id)
        }
    }

    async onEdit(priorityValue) {
        await this.setState({
            node: {
                ...this.state.node,
                priority: priorityValue
            }
        });

        this.props.setEditNodeTemplate(this.state.node);
    }

    renderNodeForm() {
        switch(this.state.node.operation) {
            case 'openFile':
                return this.openFileForm();
            case 'join':
                return this.joinForm();
            case 'filter':
                return <div/>
            default:
                return <div/>
        }
    }

    render() {
        return <div
            id='editNodeForm'
            style={{
                width: '100%'
            }}
        >
            {
                //render a form depending on what node operation
            }
        </div>
    }
}

export default EditNodeForm;