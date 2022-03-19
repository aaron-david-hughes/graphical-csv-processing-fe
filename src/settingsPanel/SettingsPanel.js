import React from 'react';
import Popup from "../generalPurposeComponents/popup/Popup";
import FormContentGenerator from "../formContentGenerator/FormContentGenerator";
import Input from "../generalPurposeComponents/input/Input";
import Switch from "../generalPurposeComponents/switch/Switch";
import {processingInputValidityStartState} from "../graphComponentForms/utils/FileNodes";
import Validation from "../graphComponentForms/validation/Validation";
import deepClone from 'lodash.clonedeep';
import Collapsible from "../generalPurposeComponents/collapsible/Collapsible";

class SettingsPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            defaultsEnabled: props.defaultsEnabled,
            config: props.config,
            beforeDefaultConfig: props.config,
            initialConfig: props.initialConfig,
            configChanged: false,
            configValidity: this.setupValidity()
        }
    }

    setupValidity() {
        let validity = {};

        this.props.config.processing.operations.forEach(op => {
            validity[op.operation] = processingInputValidityStartState(op, 'valid');
        });

        return validity;
    }

    async setDefaultsEnabled(e) {
        await this.setState({
            defaultsEnabled: e
        });

        this.props.setDefaultsEnabled(e);
    }

    async textOnBlur(e, operation, field) {
        await this.onBlur(Validation.validateTextField, e, operation, field);
    }

    async numericOnBlur(e, operation, field) {
        await this.onBlur(Validation.validateNumericField, e, operation, field);
    }

    async integerOnBlur(e, operation, field) {
        await this.onBlur(Validation.validateIntegerField, e, operation, field);
    }

    async onBlur(validate, e, operation, field) {
        if (e && e.target && e.target.value !== null && e.target.value.length === 0) {
            let configValidity = deepClone(this.state.configValidity);
            configValidity[operation][field] = 'valid';

            let config = deepClone(this.state.config);
            let opConfig = config.processing.operations.find(op => op.operation === operation);

            opConfig.template[field] = null;

            await this.setState({
                configValidity,
                config
            });
        } else {
            if (validate(e)) {
                let configValidity = deepClone(this.state.configValidity);
                configValidity[operation][field] = 'valid';

                let config = deepClone(this.state.config);
                let opConfig = config.processing.operations.find(op => op.operation === operation);

                opConfig.template[field] = e.target.value;

                await this.setState({
                    configValidity,
                    config
                });
            } else {
                //only mark invalid and change no config state
                let configValidity = deepClone(this.state.configValidity);
                configValidity[operation][field] = 'invalid';

                await this.setState({
                    configValidity
                });
            }
        }

        await this.setState({
            configChanged: this.state.config !== this.state.beforeDefaultConfig
        });
    }

    async dropdownOnChange(e, operation, field) {
        if (Validation.validateTextField(e)) {
            let config = deepClone(this.state.config);
            let opConfig = config.processing.operations.find(op => op.operation === operation);

            opConfig.template[field] = e.target.value;

            await this.setState({
                config
            });
        }
    }

    async switchOnChange(e, operation, field) {
        if (e != null) {
            let config = deepClone(this.state.config);
            let opConfig = config.processing.operations.find(op => op.operation === operation);

            opConfig.template[field] = e;

            await this.setState({
                config
            });
        }
    }

    renderNodeForm(operation, name, template) {
        return <Collapsible
            title={name}
            key={operation}
            open={false}
            id={operation + '-Collapsible'}
            style={{
                marginBottom: '0.5rem',
                marginTop: '0.5rem'
            }}
        >
            <FormContentGenerator
                isSettings={true}
                config={this.state.config}
                inputValidity={this.state.configValidity[operation]}
                nodeOperation={operation}
                nodeObj={template}
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
        </Collapsible>
    }

    render() {
        return <Popup
            id='settingsPanel'
            title='Settings'
            isOpen={true}
            close={this.props.close}
            scrollable={false}
            width='40%'
            height='60%'
        >
            <div
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
                <div
                    id='settingPanelMainBody'
                    style={{
                        height: `calc(100% - 45px)`,
                        maxHeight: `calc(100% - 45px)`,
                        overflowY: 'scroll'
                    }}
                >
                    <div>
                        <Input
                            id='defaultSwitch'
                            title='Defaults'
                            style={{width: '100%'}}
                            required={false}
                            input={
                                <Switch
                                    id='defaultSwitch-input'
                                    isChecked={this.state.defaultsEnabled}
                                    onChange={async e => this.setDefaultsEnabled(e)}
                                />
                            }
                        />
                    </div>
                    {
                        this.state.defaultsEnabled
                            ? this.state.config.processing.operations.map(op => this.renderNodeForm(op.operation, op.name, op.template))
                            : null
                    }
                </div>
                <div
                    id='settingPanelControls'
                    style={{
                        display: 'inline-flex',
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '2px solid darkslategray',
                        height: '45px',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}
                >
                    <div id='saveAndCancelButtonDiv'>
                        <button
                            title='save'
                            id='saveButton'
                            disabled={!this.state.defaultsEnabled || !this.state.configChanged}
                            onClick={async () => {
                                await this.props.updateConfig(this.state.config);
                                this.props.close();
                            }}
                        >save</button>
                        <button
                            title='cancel'
                            id='cancelButton'
                            disabled={!this.state.defaultsEnabled}
                            onClick={this.props.close}
                        >cancel</button>
                    </div>
                    <div id='restoreButtonDiv'>
                        <button
                            title='restore'
                            id='restoreButton'
                            disabled={!this.state.defaultsEnabled}
                            onClick={async () => {
                                await this.props.revertConfig();
                                this.props.close();
                            }}
                        >restore default</button>
                    </div>
                </div>
            </div>
        </Popup>
    }
}

export default SettingsPanel;