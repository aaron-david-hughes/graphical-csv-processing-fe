import React from 'react';
import {shallow, mount} from 'enzyme';
import SettingsPanel from "../SettingsPanel";
import Config from '../../config.json';

describe('SettingsPanel tests', () => {
    let config = {
        processing: {
            generalTemplate: Config.processing.generalTemplate,
            operations: [
                {
                    operation: 'test',
                    template: {
                        textField: null,
                        numericField: null,
                        integerField: null,
                        dropdownField: 'option1',
                        switchField: true
                    },
                    textField: {
                        input: 'text',
                        title: 'text field title',
                        width: '50%',
                        required: true
                    },
                    numericField: {
                        input: 'numeric',
                        title: 'numeric field title',
                        width: '50%',
                        required: true
                    },
                    integerField: {
                        input: 'integer',
                        title: 'integer field title',
                        width: '50%',
                        required: true
                    },
                    dropdownField: {
                        input: 'dropdown',
                        title: 'dropdown field title',
                        width: '100%',
                        required: true,
                        options: [
                            'option1',
                            'option2'
                        ]
                    },
                    switchField: {
                        input: 'switch',
                        title: 'switch field title',
                        width: '50%',
                        required: true
                    }
                }
            ]
        }
    }

    let props = {
        defaultsEnabled: false,
        initialConfig: config,
        config: config,
        close: jest.fn(),
        updateConfig: jest.fn(),
        revertConfig: jest.fn(),
        setDefaultsEnabled: jest.fn()
    };

    let render;
    let instance;

    beforeEach(() => {
        render = shallow(<SettingsPanel {...props} />);
        instance = render.instance();
    });

    describe('render tests', () => {
        it('should match snapshot when disabled default values', () => {
            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when enabled default values', () => {
            let localProps = {
                ...props,
                defaultsEnabled: true
            };

            render = shallow(<SettingsPanel {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should not run onClick when save button disabled due to defaultsDisabled', async () => {
            render = mount(<SettingsPanel {...props} />);

            await render.find('#saveButton').simulate('click');

            expect(props.updateConfig).not.toHaveBeenCalled();
            expect(props.close).not.toHaveBeenCalled();
        });

        it('should not run onClick when save button disabled due to no config change', async () => {
            let localProps = {
                ...props,
                defaultsEnabled: true
            };

            render = mount(<SettingsPanel {...localProps} />);

            await render.find('#saveButton').simulate('click');

            expect(props.updateConfig).not.toHaveBeenCalled();
            expect(props.close).not.toHaveBeenCalled();
        });

        it('should run onClick when save button enabled', async () => {
            let localProps = {
                ...props,
                defaultsEnabled: true
            };

            render = mount(<SettingsPanel {...localProps} />);
            instance = render.instance();

            instance.setState({
                configChanged: true
            });

            await render.find('#saveButton').simulate('click');

            expect(props.updateConfig).toHaveBeenCalled();
            expect(props.close).toHaveBeenCalled();
        });

        it('should not run onClick when cancel button disabled due to defaultsDisabled', async () => {
            render = mount(<SettingsPanel {...props} />);

            await render.find('#cancelButton').simulate('click');

            expect(props.close).not.toHaveBeenCalled();
        });

        it('should run onClick when cancel button enabled', async () => {
            let localProps = {
                ...props,
                defaultsEnabled: true
            };

            render = mount(<SettingsPanel {...localProps} />);

            await render.find('#cancelButton').simulate('click');

            expect(props.close).toHaveBeenCalled();
        });

        it('should not run onClick when restore defaults button disabled due to defaultsDisabled', async () => {
            render = mount(<SettingsPanel {...props} />);

            await render.find('#restoreButton').simulate('click');

            expect(props.close).not.toHaveBeenCalled();
        });

        it('should run onClick when restore defaults button enabled', async () => {
            let localProps = {
                ...props,
                defaultsEnabled: true
            };

            render = mount(<SettingsPanel {...localProps} />);

            await render.find('#restoreButton').simulate('click');

            expect(props.close).toHaveBeenCalled();
        });
    });

    describe('instance tests', () => {
        describe('setDefaultsEnabled tests', () => {
            it('should set defaultsEnabled and call props setDefaultsEnabled', async () => {
                await instance.setDefaultsEnabled(true);

                expect(instance.state.defaultsEnabled).toEqual(true);
                expect(props.setDefaultsEnabled).toHaveBeenCalled();
            });
        })

        describe('textOnBlur tests', () => {
            it('should set field to be invalid when the default value is invalid', async () => {
                let e = {
                    target: {
                        value: null
                    }
                };

                await instance.textOnBlur(e, 'test', 'textField');

                expect(instance.state.configValidity.test.textField).toEqual('invalid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.textField).toEqual(null);
            });

            it('should set field to be valid when the default value is empty', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.textOnBlur(e, 'test', 'textField');

                expect(instance.state.configValidity.test.textField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.textField).toEqual(null);
            });

            it('should set field to be valid when the default value is present and valid', async () => {
                let e = {
                    target: {
                        value: 'this is text'
                    }
                };

                await instance.textOnBlur(e, 'test', 'textField');

                expect(instance.state.configValidity.test.textField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.textField).toEqual('this is text');
            });
        });

        describe('numericOnBlur tests', () => {
            it('should set field to be invalid when the default value is invalid', async () => {
                let e = {
                    target: {
                        value: 'not a number'
                    }
                };

                await instance.numericOnBlur(e, 'test', 'numericField');

                expect(instance.state.configValidity.test.numericField).toEqual('invalid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.numericField).toEqual(null);
            });

            it('should set field to be valid when the default value is empty', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.numericOnBlur(e, 'test', 'numericField');

                expect(instance.state.configValidity.test.numericField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.numericField).toEqual(null);
            });

            it('should set field to be valid when the default value is present and valid', async () => {
                let e = {
                    target: {
                        value: '1.99'
                    }
                };

                await instance.numericOnBlur(e, 'test', 'numericField');

                expect(instance.state.configValidity.test.numericField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.numericField).toEqual('1.99');
            });
        });

        describe('integerOnBlur tests', () => {
            it('should set field to be invalid when the default value is invalid', async () => {
                let e = {
                    target: {
                        value: '1.99'
                    }
                };

                await instance.integerOnBlur(e, 'test', 'integerField');

                expect(instance.state.configValidity.test.integerField).toEqual('invalid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.integerField).toEqual(null);
            });

            it('should set field to be valid when the default value is empty', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.integerOnBlur(e, 'test', 'integerField');

                expect(instance.state.configValidity.test.integerField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.integerField).toEqual(null);
            });

            it('should set field to be valid when the default value is present and valid', async () => {
                let e = {
                    target: {
                        value: '1'
                    }
                };

                await instance.integerOnBlur(e, 'test', 'integerField');

                expect(instance.state.configValidity.test.integerField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.integerField).toEqual('1');
            });
        });

        describe('dropdownOnChange tests', () => {
            it('should not set template value to input if invalid', async () => {
                let priorValidity = instance.state.configValidity.test.dropdownField;
                let priorValue = instance.state.config.processing.operations.find(op => op.operation === 'test').template.dropdownField;

                let e = {
                    target: {
                        value: null
                    }
                };

                await instance.dropdownOnChange(e, 'test', 'dropdownField');

                expect(instance.state.configValidity.test.dropdownField).toEqual(priorValidity);
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.dropdownField).toEqual(priorValue);
            });

            it('should set template value to input if valid', async () => {
                let e = {
                    target: {
                        value: 'option2'
                    }
                };

                await instance.dropdownOnChange(e, 'test', 'dropdownField');

                expect(instance.state.configValidity.test.dropdownField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.dropdownField).toEqual('option2');
            });
        });

        describe('switchOnChange tests', () => {
            it('should not set template value to input if invalid', async () => {
                let priorValidity = instance.state.configValidity.test.switchField;
                let priorValue = instance.state.config.processing.operations.find(op => op.operation === 'test').template.switchField;

                let e = null;

                await instance.switchOnChange(e, 'test', 'switchField');

                expect(instance.state.configValidity.test.switchField).toEqual(priorValidity);
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.switchField).toEqual(priorValue);
            });

            it('should set template value to input if valid', async () => {
                let e = false;

                await instance.switchOnChange(e, 'test', 'switchField');

                expect(instance.state.configValidity.test.switchField).toEqual('valid');
                expect(instance.state.config.processing.operations.find(op => op.operation === 'test').template.switchField).toEqual(false);
            });
        });
    });
});