import React from 'react';
import NodeForm, {NodeList as Nodes} from "../graphComponentForms/NodeForm";
import EdgeForm from "../graphComponentForms/EdgeForm";

class GraphController extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            steps: [
                {
                    name: 'Add Node or Edge',
                    prev: null,
                    next: null
                },
                {
                    name: 'Node Type',
                    prev: <button
                        id='prev'
                        title='prev'
                        onClick={e => this.setStep(e, 'Add Node or Edge')}
                    >
                        prev
                    </button>,
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
                    name: 'Edge Configuration',
                    prev: <button
                        id='prev'
                        title='prev'
                        onClick={e => this.setStep(e, 'Add Node or Edge')}
                    >
                        prev
                    </button>,
                    next: <button
                        id='addNode'
                        title='Add Node'
                        onClick={e => this.submitGraphComponent(e, this.props.addEdge, this.state.edgeTemplate)}
                    >
                        add edge
                    </button>
                }
            ],
            step: 'Add Node or Edge',
            nodeType: Nodes[0].id,
            nodeTemplate: {},
            edgeTemplate: {},
            isFormValid: false,
            showNotStartedErrors: false,
            file: null
        };
    }

    //good bar css
    initialStage() {
        return <div id='initialFormStage' style={{display: 'inline-flex', width: '100%'}}>
            <button
                id='nodeBtn'
                onClick={e => this.setStep(e, 'Node Type')}
                style={{
                    width: '50%',
                    margin: '1rem'
                }}
            >
                Add Node
            </button>
            <button
                id='edgeBtn'
                onClick={e => this.setStep(e, 'Edge Configuration')}
                style={{
                    width: '50%',
                    margin: '1rem'
                }}
            >
                Add Edge
            </button>
        </div>
    }

    //good bar css
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
                    Nodes.map(function(type) {
                        return <option key={type.id} value={type.id}>
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
                operation={this.state.nodeType}
                setNodeTemplate={this.setNodeTemplate.bind(this)}
                setIsFormValid={this.setIsFormValid.bind(this)}
                showNotStartedErrors={this.state.showNotStartedErrors}
                getFileAndName={this.getFileAndName.bind(this)}
            />
        </div>
    }

    edgeStage() {
        return <div>
            <EdgeForm
                setEdgeTemplate={this.setEdgeTemplate.bind(this)}
                setIsFormValid={this.setIsFormValid.bind(this)}
                graphData={this.props.graphData}
            />
        </div>
    }

    //rendering methods
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
                    step.prev
                }
                {
                    step.next
                }
            </div>
        </div>
    }

    stepComponentSwitch(step) {
        switch(step) {
            case 'Node Type':
                return this.nodeTypeStage();
            case 'Node Configuration':
                return this.nodeConfigStage();
            case 'Edge Configuration':
                return this.edgeStage();
            case 'Add Node or Edge':
            default:
                return this.initialStage();
        }
    }

    setStep(e, step) {
        if (e) {
            e.preventDefault();
        }

        this.setState({
            step: step,
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

    setEdgeTemplate(obj) {
        this.setState({
            edgeTemplate: obj
        });
    }

    setIsFormValid(isValid) {
        for(const entry of Object.entries(isValid)) {
            this.setState({
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
            this.setState({
                file: element.files.item(0)
            });
        }

        return filename;
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

            this.setStep(e, 'Add Node or Edge');
        }
    }

    render() {
        return <form id='graphControllerForm'>
            {this.renderFormSection()}
        </form>
    }
}

export default GraphController;