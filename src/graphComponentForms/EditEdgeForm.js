import React from 'react';
import Input from "../generalPurposeComponents/input/Input";

class EditEdgeForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            edge: this.props.graphData.edges.find(edge => this.props.editingId === edge.id)
        }
    }

    async onEdit(priorityValue) {
        await this.setState({
            edge: {
                ...this.state.edge,
                priority: priorityValue
            }
        });

        this.props.setEditEdgeTemplate(this.state.edge);
    }

    isPriorityRelevant() {
        let toNode = this.state.edge.to;
        return this.props.graphData.nodes.find(node => toNode === node.id).operation === 'join';
    }

    render() {
        return <div
            id='editEdgeForm'
            style={{
                width: '100%'
            }}
        >
            {
                this.isPriorityRelevant()
                    ? <div
                        style={{
                            display: 'inline-flex',
                            width: '100%'
                        }}
                    >
                        <Input
                            title='Priority'
                            style={{width: '100%'}}
                            input={
                                <input
                                    id='priority edge'
                                    type='checkbox'
                                    style={{width: 'unset'}}
                                    defaultChecked={this.state.edge.priority === 'y'}
                                    onChange={async e => {
                                        await this.onEdit(e.target.checked ? 'y' : 'n');
                                    }}
                                />
                            }
                        />
                    </div>
                    : <p>No config to edit - delete and add a new edge to alter the nodes this edge is between</p>
            }
        </div>
    }
}

export default EditEdgeForm;