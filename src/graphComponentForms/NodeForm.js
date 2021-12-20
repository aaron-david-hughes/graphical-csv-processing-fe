import React from 'react';
import Input from "../generalPurposeComponents/input/Input";
import Validation from "./validation/Validation";

class NodeForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.setOperationDependantState();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showNotStartedErrors) {
            let obj = state.inputValidity;

            for (const [key, value] of Object.entries(obj)) {
                if (value === 'notStarted') {
                    obj[key] = 'invalid';
                }
            }

            return {
                ...state,
                inputValidity: obj
            }
        }
        return null;
    }

    setOperationDependantState() {
        let validity = this.props.showNotStartedErrors ? 'invalid' : 'notStarted';

        switch (this.props.operation) {
            case 'open_file':
                return {
                    nodeObj: {
                        ...fileNodeConfig,
                        group: 'file',
                        operation: 'open_file',
                        name: null
                    },
                    inputValidity: {
                        name: validity
                    }
                };
            case 'write_file':
                return {
                    nodeObj: {
                        ...fileNodeConfig,
                        group: 'file',
                        operation: 'write_file',
                        name: null
                    },
                    inputValidity: {
                        name: validity
                    }
                };
            default:
                let template = this.props.config.processing.operations
                    .find(op => op.operation === this.props.operation).template;
                return {
                    nodeObj: {
                        ...this.props.config.processing.generalTemplate,
                        group: 'processing',
                        ...template
                    },
                    inputValidity: {
                        ...this.processingInputValidityStartState(template, validity)
                    }
                };
        }
    }

    processingInputValidityStartState(template, validity) {
        let inputValidity = {};

        for (let [key, value] of Object.entries(template)) {
            if (value === null) {
                inputValidity[key] = validity
            }
        }

        return inputValidity;
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
                    display: 'inline-flex',
                    width: '100%'
                }}
            >
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
                                await this.setNodeObjKey('name', this.props.getFileAndName(e));
                                this.props.setNodeTemplate(this.state.nodeObj);
                                this.setInputValidity('name', 'valid')
                            }}
                        />
                    }
                />
            </div>
        </div>
    }

    processElementContent() {
        let operation = this.props.config.processing.operations.find(op => op.operation === this.props.operation);

        return <div
            id={'processingForm-' + this.props.operation}
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%'
            }}
        >
            {
                Object.keys(operation.template).filter(key => key !== 'operation').map(field =>
                    this.generateField(field, operation[field])
                )
            }
        </div>
    }

    generateField(field, fieldConfig) {
        switch (fieldConfig.input) {
            case 'text':
                return this.textField(field, fieldConfig);
            case 'dropdown':
                return this.dropdownField(field, fieldConfig);
            default:
                console.log('input unknown');
        }
    }

    textField(field, fieldConfig) {
        return <Input
            key={field}
            id={field}
            errorText={fieldConfig.errorText ? fieldConfig.errorText : 'Please fill in this field.'}
            title={fieldConfig.title}
            isInvalid={this.state.inputValidity[field] === 'invalid'}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <input
                    id={field}
                    type='text'
                    onBlur={async e => {
                        if (Validation.validateTextField(e)) {
                            await this.setNodeObjKey(field, e.target.value)
                            this.props.setNodeTemplate(this.state.nodeObj);
                            this.setInputValidity(field, 'valid');
                        } else {
                            this.setInputValidity(field, 'invalid');
                        }
                    }}
                />
            }
        />
    }

    dropdownField(field, fieldConfig) {
        return <Input
            key={field}
            id={field}
            title={fieldConfig.title}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <select
                    id={field}
                    style={{
                        width: '100%',
                        padding: '1px 2px'
                    }}
                    value={fieldConfig.options[0]}
                    onChange={async e => {
                        if (Validation.validateTextField(e)) {
                            await this.setNodeObjKey(field, e.target.value);
                            this.props.setNodeTemplate(this.state.nodeObj);
                        }
                    }}
                >
                    {
                        fieldConfig.options.map(function(type) {
                            return <option key={type} value={type}>
                                {type}
                            </option>
                        })
                    }
                </select>
            }
        />
    }

    renderFormContent() {
        switch(this.props.operation) {
            case 'open_file':
                return this.openFileForm();
            case 'write_file':
                return <div/>;
            default:
                return this.processElementContent();
        }
    }

    render() {
        return <div>
            {this.renderFormContent()}
        </div>
    }
}

export const NodeList = [
    {
        operation: 'open_file',
        name: 'Open File'
    },
    {
        operation: 'write_file',
        name: 'Write File'
    }
];

const fileNodeConfig = {
    normal:   {
        shape: "square",
        fill: "purple",
        stroke: null
    },
    hovered:  {
        shape: "square",
        fill: "purple",
        stroke: "3 #ffa000"
    },
    selected: {
        shape: "square",
        fill: "purple",
        stroke: "3 #ffa000"
    }
};

export default NodeForm;