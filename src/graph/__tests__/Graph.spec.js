import React from 'react';
import Graph, {testSetPrevEdgeState, testUnsetPrevEdgeState, testSetFromNode, testSetGraph} from "../Graph";
import GraphData from "./GraphData.json";
import Config from "../../config.json";
import deepClone from 'lodash.clonedeep';
import {shallow} from "enzyme";

describe('Graph tests', () => {

    let render;
    let instance;

    let props = {
        graphData: GraphData,
        setEditNode: jest.fn(),
        invalidNodeCardinalities: [],
        invalidNodes: [],
        addBanner: jest.fn(),
        addEdge: jest.fn(),
        config: Config
    };


    beforeEach(() => {
        render = shallow(<Graph {...props} />);
        instance = render.instance();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Graph instance tests', () => {
        describe('getDerivedStateFromProps tests', () => {
            it('should return updated state when graph and graph.da are set', () => {
                let output = Graph.getDerivedStateFromProps({...props, graphData: GraphData}, {graphData: {}});

                expect(output).toBeDefined();
                expect(output.graphData).toEqual(GraphData);
            });
        });

        describe('determineNodeBorderColor tests', () => {
            it('should set border colour of invalid and valid nodes as per validity arrays', () => {

                let output = Graph.determineNodeBorderColor(GraphData, ['1'], ['2']);

                expect(output).toBeDefined();
                expect(output.nodes[0].normal.stroke).toEqual('3 #58CD36');
                expect(output.nodes[0].hovered.stroke).toEqual('3 #58CD36');
                expect(output.nodes[0].selected.stroke).toEqual('3 #58CD36');
                expect(output.nodes[1].normal.stroke).toEqual('3 #FF272A');
                expect(output.nodes[1].hovered.stroke).toEqual('3 #FF272A');
                expect(output.nodes[1].selected.stroke).toEqual('3 #FF272A');
                expect(output.nodes[2].normal.stroke).toEqual('3 #FF272A');
                expect(output.nodes[2].hovered.stroke).toEqual('3 #FF272A');
                expect(output.nodes[2].selected.stroke).toEqual('3 #FF272A');
                expect(output.nodes[3].normal.stroke).toEqual('3 #58CD36');
                expect(output.nodes[3].hovered.stroke).toEqual('3 #58CD36');
                expect(output.nodes[3].selected.stroke).toEqual('3 #58CD36');
            });
        });

        describe('saveCoordinates', () => {
            it('should not set coordinates when graph undefined', () => {
                let graph = null;

                let mutableGraphData = deepClone(GraphData);

                Graph.saveCoordinates(mutableGraphData, graph);

                expect(mutableGraphData).toEqual(GraphData);
            });

            it('should not set coordinates when graph.da undefined', () => {
                let graph = {};

                let mutableGraphData = deepClone(GraphData);

                Graph.saveCoordinates(mutableGraphData, graph);

                expect(mutableGraphData).toEqual(GraphData);
            });

            it('should set coordinates when graph.da defined', () => {
                let graph = {
                    da:
                    [
                        {
                            id: '0',
                            position: {
                                x: 'test-x',
                                y: 'test-y'
                            }
                        }
                    ]
                };

                let mutableGraphData = deepClone(GraphData);

                Graph.saveCoordinates(mutableGraphData, graph);

                expect(mutableGraphData.nodes[0].x).toEqual('test-x');
                expect(mutableGraphData.nodes[0].y).toEqual('test-y');
            });
        });

        describe('editNodeListenerImpl tests', () => {
            it('should only set coordinates when tag is undefined', () => {
                let e = {
                    domTarget: {}
                }

                let saveCoordinates = jest.fn();

                instance.editNodeListenerImpl(e, props.setEditNode, props, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(props.setEditNode).not.toHaveBeenCalled();
            });

            it('should only set coordinates when tag type is not node', () => {
                let e = {
                    domTarget: {
                        tag: {
                            type: undefined
                        }
                    }
                }

                let saveCoordinates = jest.fn();

                instance.editNodeListenerImpl(e, props.setEditNode, props, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(props.setEditNode).not.toHaveBeenCalled();
            });

            it('should only set coordinates and set edit node when tag type is  node', () => {
                let e = {
                    domTarget: {
                        tag: {
                            type: 'node'
                        }
                    }
                }

                let saveCoordinates = jest.fn();

                testSetPrevEdgeState();

                instance.editNodeListenerImpl(e, props.setEditNode, props, saveCoordinates);

                testUnsetPrevEdgeState();

                expect(saveCoordinates).toHaveBeenCalled();
                expect(props.setEditNode).toHaveBeenCalled();
            });
        });

        describe('deleteEdgeListenerImpl tests', () => {
            it('should only set coordinates when tag is undefined', () => {
                let e = {
                    domTarget: {}
                }

                let deleteEdge = jest.fn();
                let saveCoordinates = jest.fn();

                instance.deleteEdgeListenerImpl(e, deleteEdge, props, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(deleteEdge).not.toHaveBeenCalled();
                expect(props.addBanner).not.toHaveBeenCalled();
            });

            it('should only set coordinates when tag type is not edge', () => {
                let e = {
                    domTarget: {
                        tag: {
                            type: undefined
                        }
                    }
                }

                let deleteEdge = jest.fn();
                let saveCoordinates = jest.fn();

                instance.deleteEdgeListenerImpl(e, deleteEdge, props, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(deleteEdge).not.toHaveBeenCalled();
                expect(props.addBanner).not.toHaveBeenCalled();
            });

            it('should only set coordinates and set edit node when tag type is edge', () => {
                let e = {
                    domTarget: {
                        tag: {
                            type: 'edge'
                        }
                    }
                }

                let deleteEdge = jest.fn();
                let saveCoordinates = jest.fn();

                instance.deleteEdgeListenerImpl(e, deleteEdge, props, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(deleteEdge).toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalled();
            });
        });

        describe('edgeListenerImpl tests', () => {
            it('should only call save coordinate function if tag undefined', () => {
                let e = {
                    domTarget: {}
                }

                let state = {graphData: GraphData}

                let editEdges = jest.fn();
                let saveCoordinates = jest.fn();

                instance.edgeListenerImpl(e, state, props, editEdges, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(editEdges).not.toHaveBeenCalled();
            });

            it('should only call save coordinate function if tag type not node', () => {
                let e = {
                    domTarget: {
                        tag: {
                            type: undefined
                        }
                    }
                }

                let state = {graphData: GraphData}

                let editEdges = jest.fn();
                let saveCoordinates = jest.fn();

                instance.edgeListenerImpl(e, state, props, editEdges, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(editEdges).not.toHaveBeenCalled();
            });

            it('should call save coordinate and edit edge functions if tag is node', () => {
                let e = {
                    domTarget: {
                        tag: {
                            type: 'node'
                        }
                    }
                }

                let state = {graphData: GraphData}

                let editEdges = jest.fn();
                let saveCoordinates = jest.fn();

                instance.edgeListenerImpl(e, state, props, editEdges, saveCoordinates);

                expect(saveCoordinates).toHaveBeenCalled();
                expect(editEdges).toHaveBeenCalled();
            });
        });

        describe('editEdges tests', () => {
            it('should set from node when no node previously selected', () => {
                testSetFromNode(null);

                instance.editEdges({graphData: GraphData}, {id: '0'}, props);

                expect(props.addEdge).not.toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalledWith({
                    msg: 'Selected node 0',
                    type: 'success'
                });
            });

            it('should indicate the previously selected node has been unselected', () => {
                testSetFromNode('0');

                instance.editEdges({graphData: GraphData}, {id: '0'}, props);

                expect(props.addEdge).not.toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalledWith({
                    msg: 'Unselected node 0',
                    type: 'success'
                });
            });

            it('should indicate an edge has been added', () => {
                testSetFromNode('0');

                instance.editEdges({graphData: GraphData}, {id: '3'}, props);

                expect(props.addEdge).toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalledWith({
                    msg: 'Edge added from 0 to 3',
                    type: 'success'
                });
            });

            it('should indicate problem when adding an edge which already exists', () => {
                testSetFromNode('0');

                instance.editEdges({graphData: GraphData}, {id: '2'}, props);

                expect(props.addEdge).not.toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalledWith({
                    msg: 'Edge already exists between 0 and 2, you can double click the edge to delete it.',
                    type: 'failure'
                });
            });

            it('should indicate problem when adding an edge when its reverse already exists', () => {
                testSetFromNode('2');

                instance.editEdges({graphData: GraphData}, {id: '0'}, props);

                expect(props.addEdge).not.toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalled();
                expect(props.addBanner).toHaveBeenCalledWith({
                    msg: 'An edge between 2 and 0 already exists.',
                    type: 'failure'
                });
            });

            it('should quit early if coordinates of any node in the graph are found to have change', () => {
                testSetFromNode('0');
                testSetGraph({
                    da: [
                        {
                            id: '0',
                            position: {
                                x: '2',
                                y: '2'
                            }
                        }
                    ]
                });

                let localGraphData = {
                    "nodes": [
                        {
                            "id": "0",
                            "x": 0,
                            "y": 0
                        }
                    ],
                    "edges": []
                }

                instance.editEdges({graphData: localGraphData}, {id: '2'}, props);

                expect(props.addEdge).not.toHaveBeenCalled();
                expect(props.addBanner).not.toHaveBeenCalled();
            });
        });
    });
});