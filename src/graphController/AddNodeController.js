import React from 'react';
import NodeForm from "../graphComponentForms/NodeForm";
import FileNodes, {AllNodeTypes, isValidFromStart, getNodeObjTemplate} from '../graphComponentForms/utils/FileNodes';

class AddNodeController extends React.Component {

    constructor(props) {
        super(props);

        let nodeTypes = AllNodeTypes(props.config);

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
                }
            ],
            step: 'Node Type',
            nodeTypes: nodeTypes,
            nodeType: FileNodes["Open File"].operation,
            nodeTemplate: {},
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
            nodeType: e.target.value,
            isFormValid: isValidFromStart(this.props.config, e.target.value)
        });
    }

    nodeConfigStage() {
        return !isValidFromStart(this.props.config, this.state.nodeType)
            ? <div>
                <NodeForm
                    config={this.state.config}
                    operation={this.state.nodeType}
                    setNodeTemplate={this.setNodeTemplate.bind(this)}
                    setIsFormValid={this.setIsFormValid.bind(this)}
                    showNotStartedErrors={this.state.showNotStartedErrors}
                    setFileAndName={this.setFileAndName.bind(this)}
                    addBanner={this.props.addBanner}
                    graphData={this.props.graphData}
                    file={this.state.file}
                />
            </div>
            : null;
    }

    renderFormSection() {
        let name = this.state.step;
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
            case 'Node Type':
            default:
                return this.nodeTypeStage();
        }
    }

    setStep(e, step) {
        if (e) {
            e.preventDefault();
        }

        this.setState({
            step,
            showNotStartedErrors: false,
            isFormValid: isValidFromStart(this.props.config, this.state.nodeType),
            nodeTemplate: {
                ...getNodeObjTemplate(this.props.config, this.state.nodeType),
                inputCardinality: 0,
                outputCardinality: 0
            },
            file: null
        });
    }

    setNodeTemplate(obj) {
        this.setState({
            nodeTemplate: {
                ...obj,
                inputCardinality: 0,
                outputCardinality: 0
            }
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

    setFileAndName(file, name) {
        this.setState({
            file: {
                name, file
            }
        });
    }

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

    render() {
        return <form id='addControllerForm'>
            {this.renderFormSection()}
        </form>
    }
}

export default AddNodeController;