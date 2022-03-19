import React from 'react';
import {mount, shallow} from 'enzyme';
import Config from '../../config.json';
import EditNodeController from "../EditNodeController";

describe('EditNodeController tests', () => {
    let props = {
        node: {
            operation: "join",
            specificOperation: "join_left",
            onLeft: null,
            onRight: null,
            joinType: "left",
            expectedInputs: 2,
            inputCardinality: 0,
            outputCardinality: 0
        },
        graphData: {
            node: [{
                operation: "join",
                specificOperation: "join_left",
                onLeft: null,
                onRight: null,
                joinType: "left",
                expectedInputs: 2
            }],
            edge: []
        },
        invalidNodes: [],
        config: Config,
        removeFile: jest.fn(),
        addFile: jest.fn(),
        editNode: jest.fn(),
        setValidNode: jest.fn(),
        close: jest.fn(),
        deleteNode: jest.fn(),
        addBanner: jest.fn()
    };

    let render;
    let instance;

    beforeEach(() => {
        render = shallow(<EditNodeController {...props} />);
        instance = render.instance();
    });

    describe('render tests', () => {
        it('should match snapshot', () => {
            expect(render).toMatchSnapshot();
        });

        it('should run onClick method when edit button clicked', async () => {
            render = mount(<EditNodeController {...props} />);
            instance = render.instance();

            let onEditSubmitSpy = jest.spyOn(instance, 'onEditSubmit');

            await render.find('#edit').simulate('click');

            expect(onEditSubmitSpy).toHaveBeenCalled();
        });

        it('should run onClick method when cancel button clicked', () => {
            render = mount(<EditNodeController {...props} />);

            render.find('#cancel').simulate('click');

            expect(props.close).toHaveBeenCalled();
        });

        it('should run onClick method when delete button clicked', () => {
            render = mount(<EditNodeController {...props} />);
            instance = render.instance();

            let onDeleteSubmitSpy = jest.spyOn(instance, 'onDeleteSubmit');

            render.find('#delete').simulate('click');

            expect(onDeleteSubmitSpy).toHaveBeenCalled();
        });
    });

    describe('instance tests', () => {
        describe('onNodeTypeChange tests', () => {
            it('should prepare state when specificOperation matches target', () => {
                let e = {
                    target: {
                        value: 'join_left'
                    }
                };

                instance.onNodeTypeChange(e);

                expect(instance.state.nodeType).toEqual('join_left');
                expect(instance.state.showNotStartedErrors).toEqual(true);
                expect(instance.state.isFormValid).toEqual(true);
                expect(instance.state.isFormValid).toEqual(true);
                expect(instance.state.nodeTemplate).toEqual(props.node);
            });

            it('should prepare state when operation matches target', () => {
                let localProps = {
                    ...props,
                    node: {
                        operation: "drop_alias",
                        expectedInputs: 2
                    }
                };

                render = shallow(<EditNodeController {...localProps} />);
                instance = render.instance();

                let e = {
                    target: {
                        value: 'drop_alias'
                    }
                };

                instance.onNodeTypeChange(e);

                expect(instance.state.nodeType).toEqual('drop_alias');
                expect(instance.state.showNotStartedErrors).toEqual(true);
                expect(instance.state.isFormValid).toEqual(true);
                expect(instance.state.isFormValid).toEqual(true);
                expect(instance.state.nodeTemplate).toEqual(localProps.node);
            });
        });

        describe('setNodeTemplate tests', () => {
            it('should set supplied object to nodeTemplate', () => {
                let obj = {
                    testLabel: 'testValue'
                };

                instance.setNodeTemplate(obj);

                expect(instance.state.nodeTemplate).toEqual({
                    ...obj,
                    inputCardinality: 0,
                    outputCardinality: 0
                });
            });
        });

        describe('setIsFormValid tests', () => {
            it('should set form invalid when a key is invalid', async () => {
                let obj = {
                    label1: 'valid',
                    label2: 'invalid',
                    label3: 'valid'
                };

                await instance.setIsFormValid(obj);

                expect(instance.state.isFormValid).toEqual(false);
            });

            it('should set form valid when all keys are valid', async () => {
                let obj = {
                    label1: 'valid',
                    label2: 'valid',
                    label3: 'valid'
                };

                await instance.setIsFormValid(obj);

                expect(instance.state.isFormValid).toEqual(true);
            });
        });

        describe('setFileAndName tests', () => {
            it('should set file as per input', () => {
                instance.setFileAndName('testFile', 'testFileName');

                expect(instance.state.file).toEqual({
                    file: 'testFile',
                    name: 'testFileName'
                });
            });
        });

        describe('onEditSubmit tests', () => {
            it('should not submit when form is not valid', async () => {
                await instance.setState({
                    isFormValid: false
                });

                let e = {
                    preventDefault: jest.fn()
                };

                await instance.onEditSubmit(e);

                expect(e.preventDefault).toHaveBeenCalled();
                expect(props.removeFile).not.toHaveBeenCalled();
                expect(props.addFile).not.toHaveBeenCalled();
                expect(props.editNode).not.toHaveBeenCalled();
                expect(props.setValidNode).not.toHaveBeenCalled();
                expect(props.close).not.toHaveBeenCalled();
                expect(instance.state.showNotStartedErrors).toEqual(true);
            });

            it('should submit without file logic when not an open_file node', async () => {
                await instance.setState({
                    isFormValid: true
                });

                let e = {
                    preventDefault: jest.fn()
                };

                await instance.onEditSubmit(e);

                expect(e.preventDefault).toHaveBeenCalled();
                expect(props.removeFile).not.toHaveBeenCalled();
                expect(props.addFile).not.toHaveBeenCalled();
                expect(props.editNode).toHaveBeenCalled();
                expect(props.setValidNode).toHaveBeenCalled();
                expect(props.close).toHaveBeenCalled();
                expect(instance.state.showNotStartedErrors).toEqual(true);
            });

            it('should submit with file logic when open_file node', async () => {
                await instance.setState({
                    isFormValid: true,
                    node: {
                        ...instance.state.node,
                        operation: 'open_file',
                        name: 'testFileName'
                    },
                    nodeType: 'open_file'
                });

                let e = {
                    preventDefault: jest.fn()
                };

                await instance.onEditSubmit(e);

                expect(e.preventDefault).toHaveBeenCalled();
                expect(props.removeFile).toHaveBeenCalled();
                expect(props.addFile).toHaveBeenCalled();
                expect(props.editNode).toHaveBeenCalled();
                expect(props.setValidNode).toHaveBeenCalled();
                expect(props.close).toHaveBeenCalled();
                expect(instance.state.showNotStartedErrors).toEqual(true);
            });
        });

        describe('onDeleteSubmit tests', () => {
            it('should only remove node when not open_file node', () => {
                let e = {
                    preventDefault: jest.fn()
                };

                instance.onDeleteSubmit(e);

                expect(props.removeFile).not.toHaveBeenCalled();
                expect(e.preventDefault).toHaveBeenCalled();
                expect(props.deleteNode).toHaveBeenCalled();
                expect(props.setValidNode).toHaveBeenCalled();
                expect(props.close).toHaveBeenCalled();
            });

            it('should remove node and file when open_file node', async () => {
                await instance.setState({
                    node: {
                        operation: 'open_file'
                    }
                });

                let e = {
                    preventDefault: jest.fn()
                };

                instance.onDeleteSubmit(e);

                expect(props.removeFile).toHaveBeenCalled();
                expect(e.preventDefault).toHaveBeenCalled();
                expect(props.deleteNode).toHaveBeenCalled();
                expect(props.setValidNode).toHaveBeenCalled();
                expect(props.close).toHaveBeenCalled();
            });
        });
    });
});