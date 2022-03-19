import React from 'react';
import {shallow} from 'enzyme';
import Config from "../../config.json";
import Home, {functions} from '../Home';
import * as Requests from '../../ajax/requests';

describe('Home tests', () => {
    let config = {
        processing: {
            generalTemplate: Config.processing.generalTemplate,
            operations: [
                {
                    operation: 'test',
                    template: {
                        operation: 'test',
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
    };

    let render;
    let instance;

    beforeEach(() => {
        render = shallow(<Home config={config} />);
        instance = render.instance();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('render tests', () => {
        it('should match snapshot when no popup is open', () => {
            expect(render).toMatchSnapshot();
        });

        it('should render banners when present', () => {
            instance.setState({
                banners: [
                    {
                        id: 0,
                        msg: 'test-msg',
                        status: 'neutral'
                    }
                ]
            });

            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when settings is open', () => {
            instance.setState({
                isSettings: true
            });

            expect(render).toMatchSnapshot();
        });

        describe('save graph tests', () => {
            it('should match snapshot when save graph is open', () => {
                instance.setState({
                    savePopup: true
                });
                expect(render).toMatchSnapshot();
            });

            it('should run onClick function when saveWithConfig button clicked', () => {
                instance.setState({
                    savePopup: true
                });

                let saveGraphWithConfigSpy = jest.spyOn(functions, 'saveGraphWithConfig');

                render.find('#saveWithConfigButton').simulate('click', { preventDefault: jest.fn() });

                expect(saveGraphWithConfigSpy).toHaveBeenCalled();
            });

            it('should run onClick function when saveGraphConfigTemplate button clicked', () => {
                instance.setState({
                    savePopup: true
                });

                let saveGraphConfigTemplateSpy = jest.spyOn(functions, 'saveGraphConfigTemplate');

                render.find('#saveConfigTemplateButton').simulate('click', { preventDefault: jest.fn() });

                expect(saveGraphConfigTemplateSpy).toHaveBeenCalled();
            });

            it('should run onClick function when saveTemplate button clicked', () => {
                instance.setState({
                    savePopup: true
                });

                let saveGraphTemplateSpy = jest.spyOn(functions, 'saveGraphTemplate');

                render.find('#saveTemplateButton').simulate('click', { preventDefault: jest.fn() });

                expect(saveGraphTemplateSpy).toHaveBeenCalled();
            });
        });

        describe('load popup tests', () => {
            it('should match snapshot when load graph is open', () => {
                instance.setState({
                    loadPopup: true
                });

                expect(render).toMatchSnapshot();
            });

            it('should run onChange function when change happens to input', () => {
                instance.setState({
                    loadPopup: true
                });

                let loadGraphSpy = jest.spyOn(functions, 'loadGraph').mockReturnValue(true);

                render.find('#loadGraphFileInput').simulate('change', { preventDefault: jest.fn() });

                expect(loadGraphSpy).toHaveBeenCalled();
            });
        });

        it('should match snapshot when edit node is open', () => {
            instance.setState({
                editingNode: {
                    operation: 'test',
                    textField: null,
                    numericField: null,
                    integerField: null,
                    dropdownField: 'option1',
                    switchField: true
                }
            });

            expect(render).toMatchSnapshot();
        });
    });

    describe('instance tests', () => {
        describe('addNode tests', () => {
            it('should add node object with an id', () => {
                instance.addNode({
                    label: 'value',
                    expectedInputs: 1,
                    inputCardinality: 1
                });

                expect(instance.state.graphData.nodes).toEqual([
                    {
                        id: '0',
                        label: 'value',
                        expectedInputs: 1,
                        inputCardinality: 1
                    }
                ]);
                expect(instance.state.invalidNodeCardinalities).toEqual([]);
                expect(instance.state.counter).toEqual(1);
            });

            it('should add node id to invalid cardinalities when input cardinality wrong', () =>{
                instance.addNode({
                    label: 'value',
                    expectedInputs: 1,
                    inputCardinality: 0
                });

                expect(instance.state.graphData.nodes).toEqual([
                    {
                        id: '0',
                        label: 'value',
                        expectedInputs: 1,
                        inputCardinality: 0
                    }
                ]);
                expect(instance.state.invalidNodeCardinalities).toEqual(['0']);
                expect(instance.state.counter).toEqual(1);
            });
        });

        describe('setEditNode tests', () => {
            beforeEach(() => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '0'}, {id: '1'}
                        ],
                        edges: [
                            {from: '0', to: '1'}
                        ]
                    },
                    edgeCounter: 1,
                    invalidNodeCardinalities: ['1'],
                    banners: [{id: '0', msg: 'test banner', status: 'success'}]
                });
            });

            it('should set edit node to specified id and restore graph details', () => {
                instance.setEditNode('0', {
                    graphData: {
                        nodes: [
                            {id: '0'}, {id: '1'}
                        ],
                        edges: []
                    },
                    edgeCounter: 0,
                    invalidNodeCardinalities: [],
                });

                expect(instance.state.editingNode).toEqual({id: '0'});
                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '0'}, {id: '1'}
                    ],
                    edges: []
                });
                expect(instance.state.edgeCounter).toEqual(0);
                expect(instance.state.invalidNodeCardinalities).toEqual([]);
                expect(instance.state.banners).toEqual([]);
            });
        });

        describe('unsetEditNode', () => {
            beforeEach(() => {
                instance.setState({
                    editingNode: '1'
                });
            });

            it('should unset editingNode', () => {
                instance.unsetEditNode();

                expect(instance.state.editingNode).toEqual(null);
            });
        });

        describe('editNode tests', () => {
            beforeEach(() => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '0'}, {id: '1'}
                        ],
                        edges: [
                            {from: '0', to: '1'}
                        ]
                    }
                });
            });

            it('should set node with matching id to passed object', () => {
                instance.editNode({
                    id: '0',
                    label: 'value',
                    expectedInputs: 1,
                    inputCardinality: 1
                });

                expect(instance.state.graphData.nodes).toEqual([
                    {
                        id: '0',
                        label: 'value',
                        expectedInputs: 1,
                        inputCardinality: 1
                    },
                    {id: '1'}
                ]);
                expect(instance.state.invalidNodeCardinalities).toEqual([]);
            });

            it('should set node with matching id to passed object and note invalid cardinality if so', () => {
                instance.editNode({
                    id: '0',
                    label: 'value',
                    expectedInputs: 1,
                    inputCardinality: 0
                });

                expect(instance.state.graphData.nodes).toEqual([
                    {
                        id: '0',
                        label: 'value',
                        expectedInputs: 1,
                        inputCardinality: 0
                    },
                    {id: '1'}
                ]);
                expect(instance.state.invalidNodeCardinalities).toEqual(['0']);
            });
        });

        describe('deleteNode tests', () => {
            beforeEach(() => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '0', inputCardinality: 0, outputCardinality: 2},
                            {id: '1', inputCardinality: 1, outputCardinality: 1},
                            {id: '2', inputCardinality: 2, outputCardinality: 0},
                            {id: '3', inputCardinality: 0, outputCardinality: 0}
                        ],
                        edges: [
                            {id: '0', from: '0', to: '1'},
                            {id: '1', from: '0', to: '2'},
                            {id: '2', from: '1', to: '2'}
                        ]
                    }
                });
            });

            it('should delete node and related edges', async () => {
                await instance.deleteNode('0');

                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '1', inputCardinality: 0, outputCardinality: 1},
                        {id: '2', inputCardinality: 1, outputCardinality: 0},
                        {id: '3', inputCardinality: 0, outputCardinality: 0}
                    ],
                    edges: [
                        {id: '2', from: '1', to: '2'}
                    ]
                });
            });

            it('should only delete node when no edges present to be deleted', async () => {
                await instance.deleteNode('3');

                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '0', inputCardinality: 0, outputCardinality: 2},
                        {id: '1', inputCardinality: 1, outputCardinality: 1},
                        {id: '2', inputCardinality: 2, outputCardinality: 0}
                    ],
                    edges: [
                        {id: '0', from: '0', to: '1'},
                        {id: '1', from: '0', to: '2'},
                        {id: '2', from: '1', to: '2'}
                    ]
                });
            });
        });

        describe('addEdge tests', () => {
            beforeEach(() => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '0', inputCardinality: 0, outputCardinality: 2},
                            {id: '1', inputCardinality: 1, outputCardinality: 0},
                            {id: '2', inputCardinality: 1, outputCardinality: 0},
                            {id: '3', inputCardinality: 0, outputCardinality: 0}
                        ],
                        edges: [
                            {id: '0', from: '0', to: '1'},
                            {id: '1', from: '0', to: '2'}
                        ]
                    }
                });
            });

            it('should add an edge', () => {
                instance.addEdge({
                    id: '2', from: '2', to: '3'
                });

                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '0', inputCardinality: 0, outputCardinality: 2},
                        {id: '1', inputCardinality: 1, outputCardinality: 0},
                        {id: '2', inputCardinality: 1, outputCardinality: 1},
                        {id: '3', inputCardinality: 1, outputCardinality: 0}
                    ],
                    edges: [
                        {id: '0', from: '0', to: '1'},
                        {id: '1', from: '0', to: '2'},
                        {id: '2', from: '2', to: '3'}
                    ]
                });
            });
        });

        describe('deleteEdge tests', () => {
            beforeEach(() => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '0', inputCardinality: 0, outputCardinality: 2},
                            {id: '1', inputCardinality: 1, outputCardinality: 0},
                            {id: '2', inputCardinality: 1, outputCardinality: 0},
                            {id: '3', inputCardinality: 0, outputCardinality: 0}
                        ],
                        edges: [
                            {id: '0', from: '0', to: '1'},
                            {id: '1', from: '0', to: '2'}
                        ]
                    }
                });
            });

            it('should delete edge', () => {
                instance.deleteEdge('1');

                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '0', inputCardinality: 0, outputCardinality: 1},
                        {id: '1', inputCardinality: 1, outputCardinality: 0},
                        {id: '2', inputCardinality: 0, outputCardinality: 0},
                        {id: '3', inputCardinality: 0, outputCardinality: 0}
                    ],
                    edges: [
                        {id: '0', from: '0', to: '1'}
                    ]
                });
            });
        });

        describe('validateInputs tests', () => {
            beforeEach(() => {
                instance.setState({
                    invalidNodeCardinalities: [
                        '0',
                        '1'
                    ]
                });
            });

            it('should not try to remove from list if valid and not present in invalid list', () => {
                let output = instance.validateInputs({
                    id: '2',
                    expectedInputs: 1,
                    inputCardinality: 1
                });

                expect(output).toEqual(['0', '1']);
            });

            it('should remove from list if valid and present in invalid list', () => {
                let output = instance.validateInputs({
                    id: '1',
                    expectedInputs: 1,
                    inputCardinality: 1
                });

                expect(output).toEqual(['0']);
            });

            it('should add to list if valid and not present in invalid list', () => {
                let output = instance.validateInputs({
                    id: '2',
                    expectedInputs: 1,
                    inputCardinality: 0
                });

                expect(output).toEqual(['0', '1', '2']);
            });

            it('should not add to list if valid and present in invalid list', () => {
                let output = instance.validateInputs({
                    id: '1',
                    expectedInputs: 1,
                    inputCardinality: 0
                });

                expect(output).toEqual(['0', '1']);
            });
        });

        describe('addBanner tests', () => {
            it('should add banner and increment banner id counter', () => {
                instance.addBanner({
                    label: 'value'
                });

                expect(instance.state.banners).toEqual([
                    {id: 0, label: 'value'}
                ]);
                expect(instance.state.bannerCounter).toEqual(1);
            });
        });

        describe('removeBanner tests', () => {
            beforeEach(() => {
                instance.setState({
                    banners: [
                        {id: 0},
                        {id: 1}
                    ]
                });
            });

            it('should remove banner if present in list', () => {
                instance.removeBanner(1);

                expect(instance.state.banners).toEqual([
                    {id: 0}
                ]);
            });

            it('should not remove banner if not present in list', () => {
                instance.removeBanner(2);

                expect(instance.state.banners).toEqual([
                    {id: 0}, {id: 1}
                ]);
            });
        });

        describe('addFile tests', () => {
            it('should add file object supplied', () => {
                instance.addFile({
                    name: 'testFile'
                });

                expect(instance.state.files).toEqual([
                    {
                        name: 'testFile'
                    }
                ]);
            });
        });

        describe('removeFile tests', () => {
            beforeEach(() => {
                instance.setState({
                    files: [
                        {name: 'file1'},
                        {name: 'file2'}
                    ]
                });
            });

            it('should remove file if name is found in list', () => {
                instance.removeFile('file2');

                expect(instance.state.files).toEqual([
                    {name: 'file1'}
                ]);
            });

            it('should not remove file if name is not found in list', () => {
                instance.removeFile('file3');

                expect(instance.state.files).toEqual([
                    {name: 'file1'},
                    {name: 'file2'}
                ]);
            });
        });

        describe('onSubmitForm tests', () => {
            it('should call api on submission', () => {
                let graphicalCsvProcessingAPISpy = jest.spyOn(Requests, 'graphicalCsvProcessingAPI').mockReturnValue(true);

                let e = {
                    preventDefault: jest.fn()
                };

                instance.onSubmitForm(e, 'testFileName');

                expect(e.preventDefault).toHaveBeenCalled();
                expect(graphicalCsvProcessingAPISpy).toHaveBeenCalled();
            });
        });

        describe('openSettings tests', () => {
            it('should set isSettings to true', () => {
                instance.openSettings();

                expect(instance.state.isSettings).toEqual(true);
            })
        });

        describe('closeSettings tests', () => {
            it('should set isSettings to false', () => {
                instance.closeSettings();

                expect(instance.state.isSettings).toEqual(false);
            })
        });

        describe('switchSavePopup tests', () => {
            it('should set savePopup to true if false', () => {
                instance.setState({
                    savePopup: false
                });

                instance.switchSavePopup();

                expect(instance.state.savePopup).toEqual(true);
            });

            it('should set savePopup to false if true', () => {
                instance.setState({
                    savePopup: true
                });

                instance.switchSavePopup();

                expect(instance.state.savePopup).toEqual(false);
            });
        });

        describe('switchLoadPopup tests', () => {
            it('should set loadPopup to true if false', () => {
                instance.setState({
                    loadPopup: false
                });

                instance.switchLoadPopup();

                expect(instance.state.loadPopup).toEqual(true);
            });

            it('should set loadPopup to false if true', () => {
                instance.setState({
                    loadPopup: true
                });

                instance.switchLoadPopup();

                expect(instance.state.loadPopup).toEqual(false);
            });
        });

        describe('setSaveGraphFilename tests', () => {
            it('should set to default when empty string', () => {
                instance.setSaveGraphFilename('');

                expect(instance.state.saveGraphFilename).toEqual('SaveGraph.json');
            });

            it('should suffix .json when no extension supplied string', () => {
                instance.setSaveGraphFilename('testName');

                expect(instance.state.saveGraphFilename).toEqual('testName.json');
            });

            it('should make no changes when extension supplied string', () => {
                instance.setSaveGraphFilename('testName.json');

                expect(instance.state.saveGraphFilename).toEqual('testName.json');
            });
        });

        describe('isGraphValid tests', () => {
            it('should return false when nodes length is 0', () => {
                instance.setState({
                    graphData: {
                        nodes: [],
                        edges: []
                    },
                    invalidNodes: [],
                    invalidNodeCardinalities: []
                });

                expect(instance.isGraphValid()).toEqual(false);
            });

            it('should return false when invalid nodes length not 0', () => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '1'}
                        ],
                        edges: []
                    },
                    invalidNodes: ['1'],
                    invalidNodeCardinalities: []
                });

                expect(instance.isGraphValid()).toEqual(false);
            });

            it('should return false when invalid nodes cardinalities length not 0', () => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '1'}
                        ],
                        edges: []
                    },
                    invalidNodes: [],
                    invalidNodeCardinalities: ['1']
                });

                expect(instance.isGraphValid()).toEqual(false);
            });

            it('should return true when more than 0 nodes and no invalid nodes marked', () => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '1'}
                        ],
                        edges: []
                    },
                    invalidNodes: [],
                    invalidNodeCardinalities: []
                });

                expect(instance.isGraphValid()).toEqual(true);
            });
        });

        describe('loadGraph tests', () => {
            it('should load graph with config', async () => {
                let e = {
                    target: {
                        id: 'test'
                    }
                };

                jest.spyOn(document, 'getElementById').mockReturnValue({
                    files: {
                        item: () => {
                            return {
                                text: () => {
                                    return JSON.stringify({
                                        counter: 1,
                                        edgeCounter: 1,
                                        files: {
                                            testFileName: 'data:text/html;base64,'
                                        },
                                        graphData: {
                                            nodes: [
                                                {id: '0'}
                                            ],
                                            edges: []
                                        },
                                        type: 1
                                    });
                                }
                            }
                        }
                    }
                });

                let clearGraphSpy = jest.spyOn(instance, 'clearGraph');
                let addBannerSpy = jest.spyOn(instance, 'addBanner');

                await instance.loadGraph(e);

                expect(clearGraphSpy).toHaveBeenCalled();
                expect(addBannerSpy).not.toHaveBeenCalled();
                expect(instance.state.counter).toEqual(1);
                expect(instance.state.edgeCounter).toEqual(1);
                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '0'}
                    ],
                    edges: []
                });
                expect(instance.state.invalidNodeCardinalities).toEqual([]);
                expect(instance.state.files[0].name).toEqual('testFileName');
            });

            it('should not load graph when no file urls found in loaded file', async () => {
                let e = {
                    target: {
                        id: 'test'
                    }
                };

                jest.spyOn(document, 'getElementById').mockReturnValue({
                    files: {
                        item: () => {
                            return {
                                text: () => {
                                    return JSON.stringify({
                                        counter: 1,
                                        edgeCounter: 1,
                                        files: {},
                                        graphData: {
                                            nodes: [
                                                {id: '0'}
                                            ],
                                            edges: []
                                        },
                                        type: 1
                                    });
                                }
                            }
                        }
                    }
                });

                let addBannerSpy = jest.spyOn(instance, 'addBanner');

                await instance.addBanner(e);

                expect(addBannerSpy).toHaveBeenCalled();
            });

            it('should load graph with loadGraphConfigTemplate', async () => {
                let e = {
                    target: {
                        id: 'test'
                    }
                };

                jest.spyOn(document, 'getElementById').mockReturnValue({
                    files: {
                        item: () => {
                            return {
                                text: () => {
                                    return JSON.stringify({
                                        counter: 1,
                                        edgeCounter: 1,
                                        graphData: {
                                            nodes: [
                                                {id: '0', operation: 'open_file'}
                                            ],
                                            edges: []
                                        },
                                        type: 2
                                    });
                                }
                            }
                        }
                    }
                });

                let clearGraphSpy = jest.spyOn(instance, 'clearGraph');

                await instance.loadGraph(e);

                expect(clearGraphSpy).toHaveBeenCalled();
                expect(instance.state.counter).toEqual(1);
                expect(instance.state.edgeCounter).toEqual(1);
                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '0', operation: 'open_file'}
                    ],
                    edges: []
                });
                expect(instance.state.invalidNodes).toEqual(['0']);
            });

            it('should not load graph if file loaded is invalid', async () => {
                let e = {
                    target: {
                        id: 'test'
                    }
                };

                jest.spyOn(document, 'getElementById').mockReturnValue({
                    files: {
                        item: () => {
                            return {
                                text: () => {
                                    return JSON.stringify({
                                        counter: 1,
                                        graphData: {
                                            nodes: [
                                                {id: '0', operation: 'open_file'}
                                            ],
                                            edges: []
                                        },
                                        type: 2
                                    });
                                }
                            }
                        }
                    }
                });

                let addBannerSpy = jest.spyOn(instance, 'addBanner');

                await instance.loadGraph(e);

                expect(addBannerSpy).toHaveBeenCalled();
            });

            it('should load graph with no config', async () => {
                let e = {
                    target: {
                        id: 'test'
                    }
                };

                jest.spyOn(document, 'getElementById').mockReturnValue({
                    files: {
                        item: () => {
                            return {
                                text: () => {
                                    return JSON.stringify({
                                        counter: 2,
                                        edgeCounter: 1,
                                        graphData: {
                                            nodes: [
                                                {id: '0', operation: 'open_file'},
                                                {id: '1', operation: 'test'}
                                            ],
                                            edges: []
                                        },
                                        type: 3
                                    });
                                }
                            }
                        }
                    }
                });

                let clearGraphSpy = jest.spyOn(instance, 'clearGraph');

                await instance.loadGraph(e);

                expect(clearGraphSpy).toHaveBeenCalled();
                expect(instance.state.counter).toEqual(2);
                expect(instance.state.edgeCounter).toEqual(1);
                expect(instance.state.graphData).toEqual({
                    nodes: [
                        {id: '0', operation: 'open_file'},
                        {id: '1', operation: 'test'}
                    ],
                    edges: []
                });
                expect(instance.state.invalidNodes).toEqual(['0', '1']);
            });

            it('should fail to load graph if invalid data', async () => {
                let e = {
                    target: {
                        id: 'test'
                    }
                };

                jest.spyOn(document, 'getElementById').mockReturnValue({
                    files: {
                        item: () => {
                            return {
                                text: () => {
                                    return JSON.stringify({
                                        counter: 2,
                                        graphData: {
                                            nodes: [
                                                {id: '0', operation: 'open_file'},
                                                {id: '1', operation: 'test'}
                                            ],
                                            edges: []
                                        },
                                        type: 3
                                    });
                                }
                            }
                        }
                    }
                });

                let addBannerSpy = jest.spyOn(instance, 'addBanner');

                await instance.loadGraph(e);

                expect(addBannerSpy).toHaveBeenCalled();
            });

            it('should add banner indicating issue in graph file if not matching any type', async () => {
                let e = {
                    target: {
                        id: 'test'
                    }
                };

                jest.spyOn(document, 'getElementById').mockReturnValue({
                    files: {
                        item: () => {
                            return {
                                text: () => {
                                    return JSON.stringify({
                                        type: 0
                                    });
                                }
                            }
                        }
                    }
                });

                let addBannerSpy = jest.spyOn(instance, 'addBanner');

                await instance.loadGraph(e);

                expect(addBannerSpy).toHaveBeenCalled();
            })
        });

        describe('saveGraphWithConfig tests',  () => {
            it('change this', async () => {
                let blob = new Blob([""], { type: 'text/html' });
                blob["lastModifiedDate"] = "";
                blob["name"] = "filename";

                instance.setState({
                    files: [
                        {
                            file: blob,
                            name: 'testFileName'
                        }
                    ]
                });

                let saveFileSpy = jest.spyOn(Requests, 'saveFile').mockReturnValue(true);
                let switchSavePopupSpy = jest.spyOn(instance, 'switchSavePopup').mockReturnValue(true);
                let stringifySpy = jest.spyOn(JSON, 'stringify');

                await instance.saveGraphWithConfig('testOverallFileName');

                await new Promise((r) => setTimeout(r, 2000));

                expect(stringifySpy).toHaveBeenCalledWith({
                    counter: 0,
                    edgeCounter: 0,
                    files: {
                        testFileName: 'data:text/html;base64,'
                    },
                    graphData: {
                        nodes: [],
                        edges: []
                    },
                    type: 1
                });
                expect(saveFileSpy).toHaveBeenCalled();
                expect(switchSavePopupSpy).toHaveBeenCalled();
            });
        });

        describe('saveGraphConfigTemplate', () => {
            it('should not execute when no nodes in graphData', () => {
                let saveFileSpy = jest.spyOn(Requests, 'saveFile').mockReturnValue(true);
                let switchSavePopupSpy = jest.spyOn(instance, 'switchSavePopup').mockReturnValue(true);

                instance.saveGraphConfigTemplate('testOverallFileName');

                expect(saveFileSpy).not.toHaveBeenCalled();
                expect(switchSavePopupSpy).not.toHaveBeenCalled();
            });

            it('should execute when nodes in graphData', () => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '0', operation: 'open_file', group: 'file', name: 'testFileName'},
                            {id: '1', operation: 'join_left', onLeft: 'left', onRight: 'right'}
                        ],
                        edges: [
                            {id: '0', from: '0', to: '1'}
                        ]
                    }
                });

                let saveFileSpy = jest.spyOn(Requests, 'saveFile').mockReturnValue(true);
                let switchSavePopupSpy = jest.spyOn(instance, 'switchSavePopup').mockReturnValue(true);
                let stringifySpy = jest.spyOn(JSON, 'stringify');

                instance.saveGraphConfigTemplate('testOverallFileName');

                expect(stringifySpy).toHaveBeenCalledWith({
                    counter: 0,
                    edgeCounter: 0,
                    graphData: {
                        nodes: [
                            {id: '0', operation: 'open_file', group: 'file', name: null},
                            {id: '1', operation: 'join_left', onLeft: 'left', onRight: 'right'}
                        ],
                        edges: [
                            {id: '0', from: '0', to: '1'}
                        ]
                    },
                    type: 2
                });
                expect(saveFileSpy).toHaveBeenCalled();
                expect(switchSavePopupSpy).toHaveBeenCalled();
            });
        });

        describe('saveGraphTemplate tests', () => {
            it('should not execute when no nodes in graphData', () => {
                let saveFileSpy = jest.spyOn(Requests, 'saveFile').mockReturnValue(true);
                let switchSavePopupSpy = jest.spyOn(instance, 'switchSavePopup').mockReturnValue(true);

                instance.saveGraphTemplate('testOverallFileName');

                expect(saveFileSpy).not.toHaveBeenCalled();
                expect(switchSavePopupSpy).not.toHaveBeenCalled();
            });

            it('should execute when nodes in graphData', () => {
                instance.setState({
                    graphData: {
                        nodes: [
                            {id: '0', operation: 'open_file', group: 'file', name: 'testFileName'},
                            {
                                id: '1',
                                operation: 'test',
                                textField: 'text',
                                numericField: 'numeric',
                                integerField: 'integer',
                                dropdownField: 'option1',
                                switchField: true,
                            }
                        ],
                        edges: [
                            {id: '0', from: '0', to: '1'}
                        ]
                    }
                });

                let saveFileSpy = jest.spyOn(Requests, 'saveFile').mockReturnValue(true);
                let switchSavePopupSpy = jest.spyOn(instance, 'switchSavePopup').mockReturnValue(true);
                let stringifySpy = jest.spyOn(JSON, 'stringify');

                instance.saveGraphTemplate('testOverallFileName');

                expect(stringifySpy).toHaveBeenCalledWith({
                    counter: 0,
                    edgeCounter: 0,
                    graphData: {
                        nodes: [
                            {id: '0', operation: 'open_file', group: 'file', name: null},
                            {
                                id: '1',
                                operation: 'test',
                                textField: null,
                                numericField: null,
                                integerField: null,
                                dropdownField: null,
                                switchField: null,
                            }
                        ],
                        edges: [
                            {id: '0', from: '0', to: '1'}
                        ]
                    },
                    type: 3
                });
                expect(saveFileSpy).toHaveBeenCalled();
                expect(switchSavePopupSpy).toHaveBeenCalled();
            });
        });

        describe('setValidNode tests', () => {
            it('should remove the id from the list', () => {
                instance.setState({
                    invalidNodes: ['0']
                });

                instance.setValidNode('0');

                expect(instance.state.invalidNodes).toEqual([]);
                expect(instance.state.graphValid).toEqual(true);
            });
        });

        describe('updateConfig tests', () => {
            it('should set config to what is passed in', () => {
                instance.updateConfig({
                    label: 'value'
                });

                expect(instance.state.config).toEqual({
                    label: 'value'
                });
            });
        });

        describe('revertConfig tests', () => {
            it('should reset config to what it was initially', () => {
                instance.setState({
                    config: {},
                    initialConfig: {
                        label: 'value'
                    }
                });

                instance.revertConfig();

                expect(instance.state.config).toEqual({
                    label: 'value'
                });
            });
        });

        describe('setDefaultEnabled tests', () => {
            it('should set to what is passed in', () => {
                instance.setDefaultsEnabled(true);

                expect(instance.state.defaultsEnabled).toEqual(true);
            });
        });

        describe('loading tests',  () => {
            it('should set loading to what is passed in', async () => {
                instance.loading(true);

                expect(instance.state.loading).toEqual(true);
            });
        });
    });
});