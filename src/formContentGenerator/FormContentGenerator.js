import React from 'react';
import Input from "../generalPurposeComponents/input/Input";
import Switch from "../generalPurposeComponents/switch/Switch";

class FormContentGenerator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            config: props.config,
            nodeOperation: props.nodeOperation,
            inputActionFunctions: props.inputActionFunctions
        }
    }

    generateField(field, fieldConfig) {
        switch (fieldConfig.input) {
            case 'text':
                return this.textField(field, fieldConfig, this.state.inputActionFunctions['text'].onBlur);
            case 'dropdown':
                return this.dropdownField(field, fieldConfig, this.state.inputActionFunctions['dropdown'].onChange);
            case 'switch':
                return this.switchField(field, fieldConfig, this.state.inputActionFunctions['switch'].onChange);
            default:
                console.log('input unknown');
        }
    }

    textField(field, fieldConfig, onBlur) {
        return <Input
            key={field}
            id={field}
            errorText={fieldConfig.errorText ? fieldConfig.errorText : 'Please fill in this field.'}
            title={fieldConfig.title}
            isInvalid={this.props.inputValidity[field] === 'invalid'}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <input
                    id={field}
                    type='text'
                    defaultValue={this.props.node ? this.props.node[field] : null}
                    onBlur={async e => onBlur(e, field)}
                />
            }
        />
    }

    dropdownField(field, fieldConfig, onChange) {
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
                    defaultValue={this.props.node ? this.props.node[field] : fieldConfig.options[0]}
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
        return <Input
            key={field}
            id={field}
            title={fieldConfig.title}
            style={{width: fieldConfig.width ? fieldConfig.width : '100%'}}
            required={fieldConfig.required}
            input={
                <Switch
                    isChecked={this.props.nodeObj[field]}
                    onChange={async e => onChange(e, field)}
                />
            }
        />
    }

    processElementContent() {
        let operationConfig = this.state.config.processing.operations.find(op => op.operation === this.state.nodeOperation);

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
                    .filter(key => key !== 'operation' && key !== 'expectedInputs')
                    .map(field => this.generateField(field, operationConfig[field]))
            }
        </div>
    }

    render() {
        return this.processElementContent();
    }
}

export default FormContentGenerator;