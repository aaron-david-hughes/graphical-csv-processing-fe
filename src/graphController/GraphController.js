import React from 'react';
import NodeForm, {NodeList as Nodes} from "../graphComponentForms/NodeForm";
import EditNodeForm from "../graphComponentForms/EditNodeForm";

class GraphController extends React.Component {

    constructor(props) {
        super(props);

        let nodeTypes = [
            ...Nodes.map(node => {
                return {name: node.name, operation: node.operation}
            }),
            ...props.config.processing.operations.map(node => {
                return {name: node.name, operation: node.operation}
            })
        ];

        this.state = {
            config: props.config,
            steps: [
                {
                    name: 'Node Type',
                    prev: null,
                    next: <button
                        id='next'
                        title='next'
                        onClick={e => this.setStep(e, 'Node Configuration')}
                    >
                        next
                    </button>
                },
                {
                    name: 'Node Configuration',
                    prev: <button
                        id='prev'
                        title='prev'
                        onClick={e => this.setStep(e, 'Node Type')}
                    >
                        prev
                    </button>,
                    next: <button
                        id='addNode'
                        title='Add Node'
                        onClick={e => this.submitGraphComponent(e, this.props.addNode, this.state.nodeTemplate)}
                    >
                        add node
                    </button>
                },
                {
                    name: 'Edit Node',
                    prev: <button
                        id='editNodeCancel'
                        title='Cancel'
                        onClick={e => this.setStep(e, 'Node Type')}
                    >
                        cancel
                    </button>,
                    next: <button
                        id='deleteNode'
                        title='Delete Node'
                        onClick={e => this.deleteNode(e, this.props.editingId)}
                    >
                        delete node
                    </button>
                }
            ],
            nodeTypes: nodeTypes,
            nodeType: Nodes[0].operation,
            nodeTemplate: {},
            editNodeTemplate: {},
            isFormValid: false,
            showNotStartedErrors: false,
            file: null
        };
    }

    nodeTypeStage() {
        return <div>
            <label htmlFor='nodeOptions'>Node Type</label>
            <select
                id='nodeOptions'
                onChange={this.onNodeTypeChange.bind(this)}
                required
                value={this.state.nodeType}
            >
                {
                    this.state.nodeTypes.map(function(type) {
                        return <option key={type.operation} value={type.operation}>
                            {type.name}
                        </option>
                    })
                }
            </select>
        </div>
    }

    onNodeTypeChange(e) {
        this.setState({
            nodeType: e.target.value
        });
    }

    nodeConfigStage() {
        return <div>
            <NodeForm
                config={this.state.config}
                operation={this.state.nodeType}
                setNodeTemplate={this.setNodeTemplate.bind(this)}
                setIsFormValid={this.setIsFormValid.bind(this)}
                showNotStartedErrors={this.state.showNotStartedErrors}
                getFileAndName={this.getFileAndName.bind(this)}
            />
        </div>
    }

    //todo: maybe expand to allow change of node in edit => down the line a fair bit
    editNodeStage() {
        return <div>
            <EditNodeForm
                graphData={this.props.graphData}
                editingId={this.props.editingId}
                setEditNodeTemplate={this.setEditNodeTemplate.bind(this)}
            />
        </div>
    }

    renderFormSection() {
        let name = this.props.step;
        let step = this.state.steps.find(x => x.name === name);

        return <div>
            {this.stepComponentSwitch(name)}
            <div
                style={
                    step.prev || step.next
                        ? {
                            display: 'inline-flex',
                            marginTop: '20px',
                            width: '100%',
                            justifyContent: 'space-between'
                        }
                        : {}
                }
            >
                {
                    step.prev ? step.prev : <div/>
                }
                {
                    step.next ? step.next : <div/>
                }
            </div>
        </div>
    }

    stepComponentSwitch(step) {
        switch(step) {
            case 'Node Configuration':
                return this.nodeConfigStage();
            case 'Edit Node':
                return this.editNodeStage();
            case 'Node Type':
            default:
                return this.nodeTypeStage();
        }
    }

    setStep(e, step) {
        if (e) {
            e.preventDefault();
        }

        this.props.setStep(step)

        this.setState({
            showNotStartedErrors: false,
            isFormValid: false,
            file: null
        });
    }

    setNodeTemplate(obj) {
        this.setState({
            nodeTemplate: obj
        });
    }

    setEditNodeTemplate(obj) {
        this.setState({
            editNodeTemplate: obj
        });
    }

    async setIsFormValid(isValid) {
        for(const entry of Object.entries(isValid)) {
            await this.setState({
                isFormValid: entry[1] === 'valid'
            });
            if (!this.state.isFormValid) break;
        }
    }

    getFileAndName(e) {
        let id = e.target.id;
        let element = document.getElementById(id);
        let filename = '';

        if (element && element.files && element.files.item(0) && element.files.item(0).name) {
            filename = element.files.item(0).name;

            if (this.props.graphData.nodes
                .filter(node => node.operation === 'open_file')
                .find(node => node.name === filename)
            ) {
                this.props.addBanner({
                    msg: `Multiple files with filename '${filename}' may cause unexpected behaviour`,
                    type: 'warning'
                });
            }

            this.setState({
                file: element.files.item(0)
            });
        }

        return filename;
    }

    editGraphComponent(e, editFunc, graphComponent) {
        e.preventDefault();

        editFunc(graphComponent);

        this.setStep(e, 'Add Node');
    }

    //todo: bug around validation => join onRight allowed null... only once it has been blurred once
    submitGraphComponent(e, addFunc, graphComponent) {
        e.preventDefault();

        this.setState({
            showNotStartedErrors: true
        })

        if (this.state.isFormValid) {
            addFunc(graphComponent);

            if (this.state.file) {
                this.props.addFile(this.state.file);
            }

            this.setStep(e, 'Node Type');
        }
    }

    deleteNode(e, nodeId) {
        e.preventDefault();

        // this.props.deleteNode(nodeId);
        //
        // this.setStep(e, 'Node Type');
    }

    render() {
        return <form id='graphControllerForm'>
            {this.renderFormSection()}
        </form>
    }
}

export default GraphController;