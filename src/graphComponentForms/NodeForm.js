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

        if (Object.entries(this.state.inputValidity).filter(entry => entry[1] === 'valid').length ===
            Object.entries(this.state.inputValidity).length) {
            props.setIsFormValid(this.state.inputValidity);
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

        if (props.operation !== state.nodeObj.specificOperation && props.operation !== state.nodeObj.operation) {
            newOperationState = nodeDependentState(
                !!props.node,
                props.showNotStartedErrors,
                props.config,
                props.operation
            );

            if (props.node && (props.node.specificOperation === props.operation || props.node.operation === props.operation)) {
                newOperationState.nodeObj = props.node;
            }
        }

        let returnState = null;

        if (inputValidity) {
            returnState = {
                ...returnState,
                inputValidity
            }
        }

        if (newOperationState) {
            returnState = {
                ...state,
                ...newOperationState
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

    async setInputValidity(id, isValid) {
        await this.setState({
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
                                await this.setInputValidity('name', this.props.file.file ? 'valid' : 'invalid')
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
                            onBlur={async e => this.textOnBlur.bind(this)(e, 'name', true)}
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
                        numeric: {
                            onBlur: this.numericOnBlur.bind(this)
                        },
                        integer: {
                            onBlur: this.integerOnBlur.bind(this)
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

    async textOnBlur(e, field, required) {
        if (!required && !/\S/.test(e.target.value)) {
            let defaultValue = this.props.config.processing.operations
                .find(op => {
                    console.log(op);
                    return op.operation === this.props.operation
                }).template[field];
            await this.setNodeObjKey(field, defaultValue)
            this.props.setNodeTemplate(this.state.nodeObj);
            await this.setInputValidity(field, 'valid');
        } else if (Validation.validateTextField(e)) {
            await this.setNodeObjKey(field, e.target.value.trim())
            this.props.setNodeTemplate(this.state.nodeObj);
            await this.setInputValidity(field, 'valid');
        } else {
            await this.setInputValidity(field, 'invalid');
        }
    }

    async numericOnBlur(e, field, required) {
        if (!required && !/\S/.test(e.target.value)) {
            let defaultValue = this.props.config.processing.operations
                .find(op => {
                    console.log(op);
                    return op.operation === this.props.operation
                }).template[field];
            await this.setNodeObjKey(field, defaultValue)
            this.props.setNodeTemplate(this.state.nodeObj);
            await this.setInputValidity(field, 'valid');
        } else if (Validation.validateNumericField(e)) {
            await this.setNodeObjKey(field, e.target.value.trim())
            this.props.setNodeTemplate(this.state.nodeObj);
            await this.setInputValidity(field, 'valid');
        } else {
            await this.setInputValidity(field, 'invalid');
        }
    }

    async integerOnBlur(e, field, required) {
        if (!required && !/\S/.test(e.target.value)) {
            let defaultValue = this.props.config.processing.operations
                .find(op => {
                    console.log(op);
                    return op.operation === this.props.operation
                }).template[field];
            await this.setNodeObjKey(field, defaultValue)
            this.props.setNodeTemplate(this.state.nodeObj);
            await this.setInputValidity(field, 'valid');
        } else if (Validation.validateIntegerField(e)) {
            await this.setNodeObjKey(field, e.target.value.trim())
            this.props.setNodeTemplate(this.state.nodeObj);
            await this.setInputValidity(field, 'valid');
        } else {
            await this.setInputValidity(field, 'invalid');
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