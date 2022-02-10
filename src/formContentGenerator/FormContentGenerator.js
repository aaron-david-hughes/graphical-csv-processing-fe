import React from 'react';
import Input from "../generalPurposeComponents/input/Input";
import Switch from "../generalPurposeComponents/switch/Switch";

class FormContentGenerator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nodeOperation: props.nodeOperation,
            inputActionFunctions: props.inputActionFunctions
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.nodeOperation !== state.nodeOperation) {
            return {
                ...state,
                nodeOperation: props.nodeOperation
            }
        }

        return null;
    }

    generateField(field, fieldConfig) {
        switch (fieldConfig.input) {
            case 'text':
                return this.textField(field, fieldConfig, this.state.inputActionFunctions['text'].onBlur);
            case 'numeric':
                return this.numericField(field, fieldConfig, this.state.inputActionFunctions['numeric'].onBlur);
            case 'integer':
                return this.integerField(field, fieldConfig, this.state.inputActionFunctions['integer'].onBlur);
            case 'dropdown':
                return this.dropdownField(field, fieldConfig, this.state.inputActionFunctions['dropdown'].onChange);
            case 'switch':
                return this.switchField(field, fieldConfig, this.state.inputActionFunctions['switch'].onChange);
            default:
                console.log('input unknown');
        }
    }

    textField(field, fieldConfig, onBlur) {
        let id = this.props.nodeOperation + '-' + field;
        let defaultValue = null;

        if (this.props.node) {
            defaultValue = this.props.node[field]
        }

        if (this.props.nodeObj) {
            defaultValue = this.props.nodeObj[field]
        }

        console.log(field + ' default: ' + defaultValue);

        return <Input
            key={id}
            id={id}
            errorText={fieldConfig.errorText ? fieldConfig.errorText : 'Please fill in this field.'}
            title={fieldConfig.title}
            isInvalid={this.props.inputValidity[field] === 'invalid'}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <input
                    id={id + '-input'}
                    type='text'
                    defaultValue={this.logTest(field, defaultValue)}
                    onBlur={async e => onBlur(e, field, fieldConfig.required)}
                />
            }
        />
    }

    logTest(field, defaultValue) {
        console.log(field + ' render: ' + defaultValue);
        return defaultValue;
    }

    numericField(field, fieldConfig, onBlur) {
        let id = this.props.nodeOperation + '-' + field;
        let defaultValue = null;

        if (this.props.node) {
            defaultValue = this.props.node[field]
        }

        if (this.props.nodeObj) {
            defaultValue = this.props.nodeObj[field]
        }

        return <Input
            key={id}
            id={id}
            errorText={fieldConfig.errorText ? fieldConfig.errorText : 'Please supply a number.'}
            title={fieldConfig.title}
            isInvalid={this.props.inputValidity[field] === 'invalid'}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <input
                    id={id + '-input'}
                    type='text'
                    defaultValue={defaultValue}
                    onBlur={async e => onBlur(e, field, fieldConfig.required)}
                />
            }
        />
    }

    integerField(field, fieldConfig, onBlur) {
        let id = this.props.nodeOperation + '-' + field;
        let defaultValue = null;

        if (this.props.node) {
            defaultValue = this.props.node[field]
        }

        if (this.props.nodeObj) {
            defaultValue = this.props.nodeObj[field]
        }

        return <Input
            key={id}
            id={id}
            errorText={fieldConfig.errorText ? fieldConfig.errorText : 'Please supply a integer.'}
            title={fieldConfig.title}
            isInvalid={this.props.inputValidity[field] === 'invalid'}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <input
                    id={id + '-input'}
                    type='text'
                    defaultValue={defaultValue}
                    onBlur={async e => onBlur(e, field, fieldConfig.required)}
                />
            }
        />
    }

    dropdownField(field, fieldConfig, onChange) {
        let id = this.props.nodeOperation + '-' + field;
        let defaultValue = fieldConfig.options[0];

        if (this.props.node) {
            defaultValue = this.props.node[field]
        }

        if (this.props.nodeObj) {
            defaultValue = this.props.nodeObj[field]
        }

        return <Input
            key={id}
            id={id}
            title={fieldConfig.title}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <select
                    id={id + '-input'}
                    style={{
                        width: '100%',
                        padding: '1px 2px'
                    }}
                    defaultValue={defaultValue}
                    onChange={async e => onChange(e, field)}
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

    switchField(field, fieldConfig, onChange) {
        let id = this.props.nodeOperation + '-' + field;
        return <Input
            key={id}
            id={id}
            title={fieldConfig.title}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <Switch
                    id={id + '-input'}
                    isChecked={this.props.nodeObj[field]}
                    onChange={async e => onChange(e, field)}
                />
            }
        />
    }

    processElementContent() {
        let operationConfig = this.props.config.processing.operations.find(op => op.operation === this.state.nodeOperation);

        return <div
            id={'processingForm-' + this.state.nodeOperation}
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%'
            }}
        >
            {
                Object.keys(operationConfig.template)
                    .filter(field => field !== 'operation' && field !== 'expectedInputs')
                    .filter(field => operationConfig[field] !== undefined)
                    .map(field => this.generateField(field, operationConfig[field]))
            }
        </div>
    }

    render() {
        return this.processElementContent();
    }
}

export default FormContentGenerator;