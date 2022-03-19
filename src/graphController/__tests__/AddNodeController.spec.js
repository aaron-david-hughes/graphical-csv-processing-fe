import React from 'react';
import {mount, shallow} from 'enzyme';
import AddNodeController from "../AddNodeController";
import Config from "../../config.json";
import * as FileNodesApi from "../../graphComponentForms/utils/FileNodes";

describe('AddNodeController tests', () => {
    let props = {
        addBanner: jest.fn(),
        addFile: jest.fn(),
        addNode: jest.fn(),
        config: Config,
        graphData: {
            node:[],
            edge: []
        }
    };

    let render;
    let instance;

    beforeEach(() => {
        render = shallow(<AddNodeController {...props} />);
        instance = render.instance();
    });

    describe('render tests', () => {
        it('should match snapshot for node type section', () => {
            expect(render).toMatchSnapshot();
        });

        it('should match snapshot for node config section', () => {
            render = mount(<AddNodeController {...props} />);
            render.find('#next').simulate('click');
            expect(render).toMatchSnapshot();
        });

        it('should set step to Node Type on clicking previous from node config section', () => {
            render = mount(<AddNodeController {...props} />);
            render.find('#next').simulate('click');
            instance = render.instance();

            let setStepSpy = jest.spyOn(instance, 'setStep');

            render.find('#prev').simulate('click');

            expect(setStepSpy).toHaveBeenCalled();
        });

        it('should call submitGraphComponent  clicking addNode from node config section', () => {
            render = mount(<AddNodeController {...props} />);
            render.find('#next').simulate('click');
            instance = render.instance();

            let submitGraphComponentSpy = jest.spyOn(instance, 'submitGraphComponent');

            render.find('#addNode').simulate('click');

            expect(submitGraphComponentSpy).toHaveBeenCalled();
        });
    });

    describe('instance tests', () => {
        describe('onNodeTypeChange tests', () => {
            it('should set nodeType as per event', () => {
                let e = {
                    target: {
                        value: 'join_left'
                    }
                };

                let isValidFromStartSpy = jest.spyOn(FileNodesApi, 'isValidFromStart');

                instance.onNodeTypeChange(e);

                expect(instance.state.nodeType).toEqual('join_left');
                expect(isValidFromStartSpy).toHaveBeenCalled();
            });
        });

        describe('setNodeTemplate tests', () => {
            it('should set object as nodeTemplate', () => {
                let obj = {
                    testLabel: 'testValue'
                };

                instance.setNodeTemplate(obj);

                expect(instance.state.nodeTemplate).toEqual({
                    ...obj,
                    inputCardinality: 0,
                    outputCardinality: 0
                })
            });
        });

        describe('setIsFormValid tests', () => {
            it('should set isFormValid false if any field is invalid', async () => {
                let obj = {
                    label1: 'valid',
                    label2: 'invalid',
                    label3: 'valid'
                };

                await instance.setIsFormValid(obj);

                expect(instance.state.isFormValid).toEqual(false);
            });

            it('should set isFormValid true if all fields are valid', async () => {
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
                let file = 'testFile';

                instance.setFileAndName(file, 'testFileName');

                expect(instance.state.file).toEqual({
                    file: 'testFile',
                    name: 'testFileName'
                })
            });
        });

        describe('submitGraphComponent tests', () => {
            let e = {
                preventDefault: jest.fn()
            }

            it('should not submit when form is invalid', async () => {
                await instance.setState({
                    isFormValid: false
                });

                let addFunc = jest.fn();

                instance.submitGraphComponent(e, addFunc, {});

                expect(e.preventDefault).toHaveBeenCalled();
                expect(addFunc).not.toHaveBeenCalled();
                expect(props.addFile).not.toHaveBeenCalled();
            });

            it('should submit when form is valid', async () => {
                await instance.setState({
                    isFormValid: true
                });

                let addFunc = jest.fn();

                instance.submitGraphComponent(e, addFunc, {});

                expect(e.preventDefault).toHaveBeenCalled();
                expect(addFunc).toHaveBeenCalled();
                expect(props.addFile).not.toHaveBeenCalled();
            });

            it('should submit when form is valid and save file if set', async () => {
                await instance.setState({
                    isFormValid: true,
                    file: 'testFile'
                });

                let addFunc = jest.fn();

                instance.submitGraphComponent(e, addFunc, {});

                expect(e.preventDefault).toHaveBeenCalled();
                expect(addFunc).toHaveBeenCalled();
                expect(props.addFile).toHaveBeenCalled();
            });
        });
    });
});