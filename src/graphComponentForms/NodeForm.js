import React from 'react';
import Input from "../generalPurposeComponents/input/Input";
import Validation from "./validation/Validation";
import FormContentGenerator from "../formContentGenerator/FormContentGenerator";
import {nodeDependentState} from './utils/FileNodes';

class NodeForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = nodeDependentState(
            !!this.props.node,
            this.props.showNotStartedErrors,
            this.props.config,
            this.props.operation
        );

        if (this.props.node) {
            this.state.nodeObj = this.props.node;
        }
    }

    static getDerivedStateFromProps(props, state) {
        let inputValidity = null;

        if (props.showNotStartedErrors) {
            inputValidity = state.inputValidity;

            for (const [key, value] of Object.entries(inputValidity)) {
                if (value === 'notStarted') {
                    inputValidity[key] = 'invalid';
                }
            }
        }

        let newOperationState = null

        if (props.operation !== state.nodeObj.operation) {
            newOperationState = nodeDependentState(
                !!props.node,
                props.showNotStartedErrors,
                props.config,
                props.operation
            );
        }

        let returnState = null;

        if (newOperationState) {
            returnState = {
                ...state,
                ...newOperationState
            }
        }

        if (inputValidity) {
            returnState = {
                ...returnState,
                inputValidity
            }
        }

        return returnState;
    }

    setNodeObjKey(key, value) {
        this.setState({
            nodeObj: {
                ...this.state.nodeObj,
                [key]: value
            }
        });
    }

    setInputValidity(id, isValid) {
        this.setState({
            inputValidity: {
                ...this.state.inputValidity,
                [id]: isValid
            }
        });
        this.props.setIsFormValid(this.state.inputValidity);
    }

    openFileForm() {
        return <div
            id='openFileNodeForm'
            style={{
                width: '100%'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%'
                }}
            >
                {
                    this.props.node && this.props.node.operation === this.props.operation
                        ? <div
                            style={{
                                width: '100%'
                            }}
                        >
                            <p>
                                Currently using <strong>{this.props.node.name}</strong>.
                                Supply a file below and save changes to change.
                            </p>
                        </div>
                        : null
                }
                <Input
                    errorText='Please supply a csv file.'
                    title='File'
                    isInvalid={this.state.inputValidity.name === 'invalid'}
                    style={{width: '50%'}}
                    required={true}
                    input={
                        <input
                            id='fileInput'
                            type='file'
                            accept='text/csv'
                            onChange={async e => {
                                await this.setNodeObjKey('name', this.getFileAndName(e));
                                this.props.setNodeTemplate(this.state.nodeObj);
                                this.setInputValidity('name', this.props.file.file ? 'valid' : 'invalid')
                            }}
                        />
                    }
                />
            </div>
        </div>
    }

    writeFileForm() {
        return <div
            id='writeFileNodeForm'
            style={{
                width: '100%'
            }}
        >
            <div
                style={{
                    display: 'inline-flex',
                    width: '100%'
                }}
            >
                <Input
                    id={'nameTextField'}
                    errorText={'Please fill in this field.'}
                    title={'Filename'}
                    isInvalid={this.state.inputValidity.name === 'invalid'}
                    style={{width: '100%'}}
                    required={true}
                    input={
                        <input
                            id={'nameTextInput'}
                            type='text'
                            defaultValue={this.props.node && this.props.node.operation === 'write_file' ? this.props.node.name : null}
                            onBlur={async e => this.textOnBlur.bind(this)(e, 'name')}
                        />
                    }
                />
            </div>
        </div>
    }

    renderFormContent() {
        switch(this.props.operation) {
            case 'open_file':
                return this.openFileForm();
            case 'write_file':
                return this.writeFileForm();
            default:
                return <FormContentGenerator
                    config={this.props.config}
                    inputValidity={this.state.inputValidity}
                    nodeOperation={this.props.operation}
                    node={this.props.node}
                    nodeObj={this.state.nodeObj}
                    inputActionFunctions={{
                        text: {
                            onBlur: this.textOnBlur.bind(this)
                        },
                        dropdown: {
                            onChange: this.dropdownOnChange.bind(this)
                        },
                        switch: {
                            onChange: this.switchOnChange.bind(this)
                        }
                    }}
                />
        }
    }

    async textOnBlur(e, field) {
        if (Validation.validateTextField(e)) {
            await this.setNodeObjKey(field, e.target.value.trim())
            this.props.setNodeTemplate(this.state.nodeObj);
            this.setInputValidity(field, 'valid');
        } else {
            this.setInputValidity(field, 'invalid');
        }
    }

    async dropdownOnChange(e, field) {
        if (Validation.validateTextField(e)) {
            await this.setNodeObjKey(field, e.target.value);
            this.props.setNodeTemplate(this.state.nodeObj);
        }
    }

    async switchOnChange(e, field) {
        if (e !== null) {
            await this.setNodeObjKey(field, e);
            this.props.setNodeTemplate(this.state.nodeObj);
        }
    }

    getFileAndName(e) {
        let id = e.target.id;
        let element = document.getElementById(id);
        let filename = '';
        let file = null;

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

            file = element.files.item(0);
        }

        this.props.setFileAndName(file, filename);

        return filename;
    }

    render() {
        return <div>
            {this.renderFormContent()}
        </div>
    }
}

export default NodeForm;