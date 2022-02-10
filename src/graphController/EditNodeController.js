import React from 'react';
import FileNodes, {getNodeObjTemplate, isValidFromStart} from "../graphComponentForms/utils/FileNodes";
import NodeForm from "../graphComponentForms/NodeForm";

class EditNodeController extends React.Component {
    constructor(props) {
        super(props);

        let nodeTypes = [
            ...Object.keys(FileNodes).map(fileOpName => {
                return {name: fileOpName, operation: FileNodes[fileOpName].operation}
            }),
            ...props.config.processing.operations.map(node => {
                return {name: node.name, operation: node.operation}
            })
        ];

        let nodeType = null;

        if (props.node) {
            nodeType = props.node.specificOperation ? props.node.specificOperation : props.node.operation;
        }

        this.state = {
            node: props.node,
            nodeTemplate: props.node,
            nodeTypes,
            nodeType: nodeType,
            isFormValid: (!props.invalidNodes.find(id => id === props.node.id) && props.node.operation !== 'open_file'),
            showNotStartedErrors: true,
            invalidNodes: props.invalidNodes,
            file: null
        }
    }

    nodeTypeOptions() {
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
            showNotStartedErrors: e.target.value === this.props.node.specificOperation || e.target.value === this.props.node.operation,
            isFormValid: e.target.value === this.props.node.specificOperation || e.target.value === this.props.node.operation || isValidFromStart(this.props.config, e.target.value),
            nodeTemplate:
                e.target.value === this.props.node.specificOperation || e.target.value === this.props.node.operation
                    ? this.state.node
                    : {
                        ...getNodeObjTemplate(this.props.config, e.target.value),
                        inputCardinality: this.state.node.inputCardinality,
                        outputCardinality: this.state.node.outputCardinality
                    }
        });
    }

    setNodeTemplate(obj) {
        this.setState({
            nodeTemplate: {
                ...obj,
                inputCardinality: this.state.node.inputCardinality,
                outputCardinality: this.state.node.outputCardinality
            }
        });
    }

    async setIsFormValid(isValid) {
        for (const entry of Object.entries(isValid)) {
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

    async onEditSubmit(e) {
        e.preventDefault();

        this.setState({
            showNotStartedErrors: true
        })

        if (this.state.isFormValid) {
            if (this.state.node.operation === 'open_file') {
                await this.props.removeFile(this.state.node.name);
            }

            if (this.state.nodeType === 'open_file') {
                await this.props.addFile(this.state.file);
            }

            //found the bug lol
            this.props.editNode({
                id: this.state.node.id,
                ...this.state.nodeTemplate
            });

            this.props.setValidNode(this.state.node.id);

            this.props.close();
        }
    }

    onDeleteSubmit(e) {
        if (this.state.node.operation === 'open_file') {
            this.props.removeFile(this.state.node.name);
        }

        e.preventDefault();
        this.props.deleteNode(this.state.node.id);
        this.props.setValidNode(this.state.node.id);
        this.props.close()
    }

    render() {
        return <form id='editGraphForm'>
            {this.nodeTypeOptions()}
            {
                !isValidFromStart(this.props.config, this.state.nodeType)
                    ? <NodeForm
                        config={this.props.config}
                        node={this.state.node}
                        operation={this.state.nodeType}
                        setNodeTemplate={this.setNodeTemplate.bind(this)}
                        setIsFormValid={this.setIsFormValid.bind(this)}
                        showNotStartedErrors={this.state.showNotStartedErrors}
                        setFileAndName={this.setFileAndName.bind(this)}
                        addBanner={this.props.addBanner}
                        graphData={this.props.graphData}
                        file={this.state.file}
                    />
                    : null
            }
            <div
                style={{
                    display: 'inline-flex',
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '2px solid darkslategray',
                    width: '100%',
                    justifyContent: 'space-between'
                }}
            >
                <div id='editNodeCancelButton'>
                    <button
                        title='edit'
                        id='edit'
                        onClick={async e => this.onEditSubmit(e)}
                    >edit</button>
                    <button
                        title='cancel'
                        id='cancel'
                        onClick={e => {
                            e.preventDefault();
                            this.props.close();
                        }}
                    >cancel</button>
                </div>
                <div id='editNodeDeleteAndEditButtons'>
                    <button
                        title='delete'
                        id='delete'
                        onClick={e => this.onDeleteSubmit(e)}
                    >delete</button>
                </div>
            </div>
        </form>
    }
}

export default EditNodeController;