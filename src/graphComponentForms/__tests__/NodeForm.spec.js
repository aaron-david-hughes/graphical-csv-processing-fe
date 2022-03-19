import React from 'react';
import {shallow} from 'enzyme';
import NodeForm from "../NodeForm";
import Config from "../../config.json";

describe('NodeForm tests', () => {
    let props = {
        operation: 'open_file',
        node: null,
        config: Config,
        setNodeTemplate: jest.fn(),
        setFileAndName: jest.fn(),
        addBanner: jest.fn(),
        graphData: {
            nodes: [],
            edges: []
        },
        setIsFormValid: jest.fn(),
        showNotStartedErrors: false
    };

    let render;
    let instance;

    beforeEach(() => {
        render = shallow(<NodeForm {...props} />);
        instance = render.instance();
    });

    describe('render tests', () => {
        it('should match snapshot when open_file form for adding', () => {
            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when open_file form for editing when also original node type', () => {
            let localProps = {
                ...props,
                node: {
                    operation: 'open_file',
                    name: 'open test'
                }
            };

            render = shallow(<NodeForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when open_file form for editing when not original node type', () => {
            let localProps = {
                ...props,
                node: {
                    operation: 'write_file',
                    name: 'write test'
                }
            };

            render = shallow(<NodeForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when write_file form for adding', () => {
            let localProps = {
                ...props,
                operation: 'write_file'
            };

            render = shallow(<NodeForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when write_file form for editing when also original node type', () => {
            let localProps = {
                ...props,
                node: {
                    operation: 'write_file',
                    name: 'write test'
                },
                operation: 'write_file'
            };

            render = shallow(<NodeForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when write_file form for editing when not original node type', () => {
            let localProps = {
                ...props,
                node: {
                    operation: 'open_file',
                    name: 'open test'
                },
                operation: 'write_file'
            };

            render = shallow(<NodeForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when join_left form for adding', () => {
            let localProps = {
                ...props,
                operation: 'join_left'
            };

            render = shallow(<NodeForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when join_left form for editing', () => {
            let localProps = {
                ...props,
                node: {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'value',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                },
                operation: 'join_left'
            };

            render = shallow(<NodeForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });
    });

    describe('instance tests', () => {
        describe('getDerivedStateFromProps tests', () => {
            let state = {
                nodeObj: {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'value',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                },
                inputValidity: {
                    onLeft: 'notStarted',
                    onRight: 'notStarted'
                }
            };

            describe('validity updates', () => {
                it('should not update validity if showNotStartedErrors if false', () => {
                    let props = {
                        operation: 'join_left',
                        showNotStartedErrors: false
                    };

                    let output = NodeForm.getDerivedStateFromProps(props, state);

                    expect(output).toEqual(null);
                });

                it('should not update validity if showNotStartedErrors if true', () => {
                    let props = {
                        operation: 'join_left',
                        showNotStartedErrors: true
                    };

                    let output = NodeForm.getDerivedStateFromProps(props, state);

                    expect(output).toEqual({
                        inputValidity: {
                            onLeft: 'invalid',
                            onRight: 'invalid'
                        }
                    });
                });
            });

            describe('operation updates', () => {
                it('should not update operation if operation props is same as state', () => {
                    let localProps = {
                        ...props,
                        operation: 'join_left',
                        showNotStartedErrors: false
                    };

                    let output = NodeForm.getDerivedStateFromProps(localProps, state);

                    expect(output).toEqual(null);
                });

                it('should update operation if operation props differs from state', () => {
                    let localProps = {
                        ...props,
                        operation: 'alias',
                        showNotStartedErrors: true
                    };

                    let output = NodeForm.getDerivedStateFromProps(localProps, state);

                    expect(output).toEqual({
                        inputValidity: {
                            alias: 'invalid'
                        },
                        nodeObj: {
                            ...Config.processing.operations.find(op => op.operation === 'alias').template,
                            ...Config.processing.generalTemplate
                        }
                    });
                });
            });
        });

        describe('setNodeObjKey tests', () => {
            it('should set new key value in nodeObj', () => {
                let nodeObj = instance.state.nodeObj;

                instance.setNodeObjKey('testLabel2', 'testValue2');

                expect(instance.state.nodeObj).toEqual({
                    ...nodeObj,
                    'testLabel2': 'testValue2'
                });
            });
        });

        describe('setInputValidity tests', () => {
            it('should set validity and call controller prop method', async () => {
                let validity = instance.state.inputValidity;

                await instance.setInputValidity('testId', 'testValidity');

                expect(instance.state.inputValidity).toEqual({
                    ...validity,
                    testId: 'testValidity'
                })
                expect(props.setIsFormValid).toHaveBeenCalled();
            });
        });

        describe('textOnBlur tests', () => {
            let localProps = {
                ...props,
                node: {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'value',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                },
                operation: 'join_left'
            };

            beforeEach(() => {
                render = shallow(<NodeForm {...localProps} />);
                instance = render.instance();
            });

            it('sets field validity to invalid when field is empty and required', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.textOnBlur(e, 'onLeft', true);

                expect(instance.state.inputValidity.onLeft).toEqual('invalid');
            });

            it('sets field validity to valid when field is empty but not required, setting nodeObj value to default', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.textOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
                expect(instance.state.nodeObj.onRight).toEqual(null);
            });

            it('sets field validity to valid when field is valid and required', async () => {
                let e = {
                    target: {
                        value: 'test'
                    }
                };

                await instance.textOnBlur(e, 'onRight', true);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
            });

            it('sets field validity to valid when field is valid but not required', async () => {
                let e = {
                    target: {
                        value: 'test'
                    }
                };

                await instance.textOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
            });
        });

        describe('numericOnBlur tests', () => {
            let localProps = {
                ...props,
                node: {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'text',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                },
                operation: 'join_left'
            };

            beforeEach(() => {
                render = shallow(<NodeForm {...localProps} />);
                instance = render.instance();
            });

            it('sets field validity to invalid when field is empty and required', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.numericOnBlur(e, 'onLeft', true);

                expect(instance.state.inputValidity.onLeft).toEqual('invalid');
            });

            it('sets field validity to valid when field is empty but not required, setting nodeObj value to default', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.numericOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
                expect(instance.state.nodeObj.onRight).toEqual(null);
            });

            it('sets field validity to valid when field is valid and required', async () => {
                let e = {
                    target: {
                        value: '1.99'
                    }
                };

                await instance.numericOnBlur(e, 'onRight', true);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
            });

            it('sets field validity to valid when field is valid but not required', async () => {
                let e = {
                    target: {
                        value: '1.99'
                    }
                };

                await instance.numericOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
            });

            it('sets field validity to invalid when field is valid and required', async () => {
                let e = {
                    target: {
                        value: 'text'
                    }
                };

                await instance.numericOnBlur(e, 'onRight', true);

                expect(instance.state.inputValidity.onRight).toEqual('invalid');
            });

            it('sets field validity to invalid when field is valid but not required', async () => {
                let e = {
                    target: {
                        value: 'text'
                    }
                };

                await instance.numericOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('invalid');
            });
        });

        describe('integerOnBlur tests', () => {
            let localProps = {
                ...props,
                node: {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'text',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                },
                operation: 'join_left'
            };

            beforeEach(() => {
                render = shallow(<NodeForm {...localProps} />);
                instance = render.instance();
            });

            it('sets field validity to invalid when field is empty and required', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.integerOnBlur(e, 'onLeft', true);

                expect(instance.state.inputValidity.onLeft).toEqual('invalid');
            });

            it('sets field validity to valid when field is empty but not required, setting nodeObj value to default', async () => {
                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.integerOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
                expect(instance.state.nodeObj.onRight).toEqual(null);
            });

            it('sets field validity to valid when field is valid and required', async () => {
                let e = {
                    target: {
                        value: '1'
                    }
                };

                await instance.integerOnBlur(e, 'onRight', true);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
            });

            it('sets field validity to valid when field is valid but not required', async () => {
                let e = {
                    target: {
                        value: '1'
                    }
                };

                await instance.integerOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('valid');
            });

            it('sets field validity to invalid when field is valid and required', async () => {
                let e = {
                    target: {
                        value: '1.99'
                    }
                };

                await instance.integerOnBlur(e, 'onRight', true);

                expect(instance.state.inputValidity.onRight).toEqual('invalid');
            });

            it('sets field validity to invalid when field is valid but not required', async () => {
                let e = {
                    target: {
                        value: '1.99'
                    }
                };

                await instance.integerOnBlur(e, 'onRight', false);

                expect(instance.state.inputValidity.onRight).toEqual('invalid');
            });
        });

        describe('dropdownOnChange tests', () => {
            let localProps = {
                ...props,
                node: {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'text',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                },
                operation: 'join_left'
            };

            beforeEach(() => {
                render = shallow(<NodeForm {...localProps} />);
                instance = render.instance();
            });

            it('should not set nodeObj if fails validation', async () => {
                let oldValue = instance.state.nodeObj.onRight;

                let e = {
                    target: {
                        value: ''
                    }
                };

                await instance.dropdownOnChange(e, 'onRight');

                expect(instance.state.nodeObj.onRight).toEqual(oldValue);
            });

            it('should set nodeObj if passes validation', async () => {
                let e = {
                    target: {
                        value: 'testValue'
                    }
                };

                await instance.dropdownOnChange(e, 'onRight');

                expect(instance.state.nodeObj.onRight).toEqual('testValue');
            });
        });

        describe('switchOnChange tests', () => {
            let localProps = {
                ...props,
                node: {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'text',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                },
                operation: 'join_left'
            };

            beforeEach(() => {
                render = shallow(<NodeForm {...localProps} />);
                instance = render.instance();
            });

            it('should not set nodeObj if fails validation', async () => {
                let oldValue = instance.state.nodeObj.onRight;

                let e = null;

                await instance.switchOnChange(e, 'onRight');

                expect(instance.state.nodeObj.onRight).toEqual(oldValue);
            });

            it('should set nodeObj if passes validation and switch is true', async () => {
                let e = true;

                await instance.switchOnChange(e, 'onRight');

                expect(instance.state.nodeObj.onRight).toEqual(true);
            });

            it('should set nodeObj if passes validation and switch is false', async () => {
                let e = false;

                await instance.switchOnChange(e, 'onRight');

                expect(instance.state.nodeObj.onRight).toEqual(false);
            });
        });

        describe('getFileAndName tests', () => {
            let e = {
                target: {
                    id: 'testId'
                }
            };

            it('should set call file setting function of parent with null', () => {
                document.getElementById = jest.fn().mockImplementation(() => null);

                let output = instance.getFileAndName(e);

                expect(output).toEqual('');
                expect(props.setFileAndName).toHaveBeenCalled();
                expect(props.setFileAndName).toHaveBeenCalledWith(null, '');
            });

            it('should set call file setting function of parent with test value', () => {
                let mockFile = {
                    files: {
                        item: () => {
                            return {
                                name: 'testFile'
                            }
                        }
                    }
                };

                document.getElementById = jest.fn().mockImplementation(() => {
                    return mockFile;
                });

                let output = instance.getFileAndName(e);

                expect(output).toEqual('testFile');
                expect(props.addBanner).not.toHaveBeenCalled()
                expect(props.setFileAndName).toHaveBeenCalled();
                expect(props.setFileAndName).toHaveBeenCalledWith({
                    name: 'testFile'
                }, 'testFile');
            });

            it('should set call file setting function of parent with test value and flag duplicate', () => {
                let localProps = {
                    ...props,
                    graphData: {
                        nodes: [
                            {
                                operation: 'open_file',
                                name: 'testFile'
                            }
                        ],
                        edges: []
                    }
                }

                let render = shallow(<NodeForm {...localProps} />);
                let instance = render.instance();

                let mockFile = {
                    files: {
                        item: () => {
                            return {
                                name: 'testFile'
                            }
                        }
                    }
                };

                document.getElementById = jest.fn().mockImplementation(() => {
                    return mockFile;
                });

                let output = instance.getFileAndName(e);

                expect(output).toEqual('testFile');
                expect(props.addBanner).toHaveBeenCalled()
                expect(props.setFileAndName).toHaveBeenCalled();
                expect(props.setFileAndName).toHaveBeenCalledWith({
                    name: 'testFile'
                }, 'testFile');
            });
        });
    });
});