import React from 'react';
import {shallow, mount} from 'enzyme';
import FormContentGenerator from "../FormContentGenerator";

describe('FormContentGenerator tests', () => {
    let props = {
        nodeOperation: 'testOp',
        inputActionFunctions: {
            text: {
                onBlur: jest.fn()
            },
            numeric: {
                onBlur: jest.fn()
            },
            integer: {
                onBlur: jest.fn()
            },
            dropdown: {
                onChange: jest.fn()
            },
            switch: {
                onChange: jest.fn()
            }
        },
        inputValidity: {
            textFieldName: 'valid',
            numericFieldName: 'valid',
            integerFieldName: 'valid'
        },
        nodeObj: {
            switchFieldName: true
        },
        config: {
            processing: {
                operations: [{
                    operation: 'testOp',
                    name: 'Test Operation',
                    template: {
                        operation: 'testOp',
                        textFieldName: null,
                        numericFieldName: null,
                        integerFieldName: null,
                        dropdownFieldName: 'first',
                        switchFieldName: true,
                        expectedInputs: 2
                    },
                    textFieldName: {
                        input: 'text',
                        title: 'Text Field Name',
                        width: "100%",
                        required: true
                    },
                    numericFieldName: {
                        input: 'numeric',
                        title: 'Numeric Field Name',
                        width: "100%",
                        required: true
                    },
                    integerFieldName: {
                        input: 'integer',
                        title: 'Integer Field Name',
                        width: "100%",
                        required: true
                    },
                    dropdownFieldName: {
                        input : 'dropdown',
                        title: 'Dropdown Field Name',
                        width: '100%',
                        required: true,
                        options: [
                            'first',
                            'second',
                            'third'
                        ]
                    },
                    switchFieldName: {
                        input: 'switch',
                        title: 'Switch Field Name',
                        width: '100%',
                        required: true
                    }
                }]
            }
        }
    };

    let render;

    beforeEach(() => {
        render = shallow(<FormContentGenerator {...props} />);
    });

    afterEach(() => {
        render.unmount();
    });

    describe('FormContentGenerator render tests', () => {
        it('should match snapshot', () => {
            expect(render).toMatchSnapshot();
        });

        it('should call text onBlur function when text field blur event occurs', () => {
            render = mount(<FormContentGenerator {...props} />);
            render.find('#testOp-textFieldName-input').simulate('blur');

            expect(props.inputActionFunctions.text.onBlur).toHaveBeenCalled();
        });

        it('should call numeric onBlur function when numeric field blur event occurs', () => {
            render = mount(<FormContentGenerator {...props} />);
            render.find('#testOp-numericFieldName-input').simulate('blur');

            expect(props.inputActionFunctions.numeric.onBlur).toHaveBeenCalled();
        });

        it('should call integer onBlur function when integer field blur event occurs', () => {
            render = mount(<FormContentGenerator {...props} />);
            render.find('#testOp-integerFieldName-input').simulate('blur');

            expect(props.inputActionFunctions.integer.onBlur).toHaveBeenCalled();
        });

        it('should call dropdown onChange function when dropdown change event occurs', () => {
            render = mount(<FormContentGenerator {...props} />);
            render.find('#testOp-dropdownFieldName-input').simulate('change');

            expect(props.inputActionFunctions.dropdown.onChange).toHaveBeenCalled();
        });
    });

    describe('FormContentGenerator instance tests', () => {
        it('should update state when nodeOperation prop supplied changes', () => {
            let instance = render.instance();

            let newProps = {
                nodeOperation: 'newTestOp'
            }

            expect(instance.state.nodeOperation).toEqual('testOp');

            let newState = FormContentGenerator.getDerivedStateFromProps(newProps, render.state);

            expect(newState.nodeOperation).toEqual('newTestOp');
        });
    });
});