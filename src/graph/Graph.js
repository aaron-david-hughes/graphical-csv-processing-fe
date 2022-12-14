import React from 'react';
import AnyChart from 'anychart-react/dist/anychart-react.min';
import anychart from 'anychart';
import GraphUtils from './graphUtils';
import deepClone from 'lodash.clonedeep';

let graph;
let fromNode = null;
let green = "3 #58CD36";
let red = "3 #FF272A";
let prevEdgeState = null;

class Graph extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            graphData: Graph.determineNodeBorderColor(props.graphData, props.invalidNodes, props.invalidNodeCardinalities)
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (graph && graph.da) {
            Graph.saveCoordinates(props.graphData, graph);

            return {
                ...state,
                graphData: Graph.determineNodeBorderColor(props.graphData, props.invalidNodes, props.invalidNodeCardinalities)
            };
        }

        return null;
    }

    static determineNodeBorderColor(graphData, invalidNodes, invalidNodeCardinalities) {
        graphData.nodes.forEach(node => {
            let strokeColor = invalidNodes.filter(id => id === node.id).length > 0 ||
                invalidNodeCardinalities.filter(id => id === node.id).length > 0
            ? red : green;

            node.normal.stroke = strokeColor;
            node.hovered.stroke = strokeColor;
            node.selected.stroke = strokeColor;
        });

        return graphData;
    }

    static saveCoordinates(graphData, graphVar) {
        if (graphVar && graphVar.da !== null && graphVar.da !== undefined) {
            for (let node of graphData.nodes) {
                let coordinates = graphVar.da.find(n => n.id === node.id);

                if (coordinates && coordinates.position) {
                    node.x = coordinates.position.x;
                    node.y = coordinates.position.y;
                }
            }
        }
    }

    setNodeLabels(nodes) {
        nodes.labels().enabled(true);
        nodes.labels().format('{%id}: {%operation}');
        nodes.labels().fontSize(12);
        nodes.labels().fontColor('#333333');
        nodes.labels().fontWeight(600);
    }

    setNodeAppearance(nodes) {
        nodes.normal().height(35);
        nodes.hovered().height(40);
        nodes.selected().height(45);

        nodes.normal().stroke()
    }

    setTooltip() {
        let config = this.props.config;

        graph.tooltip().useHtml(true);
        graph.tooltip().format(function() {
            if (this.type === 'node') {
                switch(this.getData('operation')) {
                    case 'open_file':
                    case 'write_file':
                        return GraphUtils.fileTooltip(this);
                    default:
                        return GraphUtils.processTooltip(this, config);
                }
            } else {
                return this.getData("from") + " -> " + this.getData("to");
            }
        });
    }

    setArrows(edges) {
        let arrows = edges.arrows();
        arrows.enabled(true);
        arrows.size(15);
    }

    setZoom() {
        let zoomController = anychart.ui.zoom();
        zoomController.target(graph);
        zoomController.render();
    }

    editNodeListenerImpl(e, setEditNode, props, listenerCoordinateSave) {
        let prevEdgeStateClone = deepClone(prevEdgeState);

        let tag = e.domTarget.tag;
        fromNode = null;

        if (tag) {
            if (tag.type === 'node' && prevEdgeStateClone) {
                //some restore edge details
                setEditNode(tag.id, prevEdgeStateClone);
            }
        }

        listenerCoordinateSave(props.graphData, graph);
    }

    editNodeListener() {
        let setEditNode = this.props.setEditNode;
        let props = this.props;
        let listenerCoordinateSave = Graph.saveCoordinates.bind(this);

        graph.listen('dblClick', (e) => this.editNodeListenerImpl(e, setEditNode, props, listenerCoordinateSave));
    }

    deleteEdgeListenerImpl(e, deleteEdge, props, listenerCoordinateSave) {
        let tag = e.domTarget.tag;

        if (tag) {
            if (tag.type === 'edge') {
                deleteEdge(tag.id);

                props.addBanner({
                    msg: 'Edge deleted',
                    type: 'success'
                })
            }
        }

        listenerCoordinateSave(props.graphData, graph);
    }

    deleteEdgeListener() {
        let deleteEdge = this.props.deleteEdge;
        let props = this.props;
        let listenerCoordinateSave = Graph.saveCoordinates.bind(this);

        graph.listen('dblClick', (e) => this.deleteEdgeListenerImpl(e, deleteEdge, props, listenerCoordinateSave));
    }

    edgeListenerImpl(e, state, props, editEdges, listenerCoordinateSave) {
        let tag = e.domTarget.tag;

        if (tag && tag.type === 'node' && !prevEdgeState) {
            prevEdgeState = {
                graphData: deepClone(state.graphData),
                edgeCounter: props.edgeCounter,
                invalidNodeCardinalities: deepClone(props.invalidNodeCardinalities)
            };

            editEdges(state, tag, props);
            listenerCoordinateSave(props.graphData, graph);

            setTimeout(() => {
                prevEdgeState = null;
            }, 500);
        } else {
            listenerCoordinateSave(props.graphData, graph);
        }
    }

    edgeListener() {
        let state = this.state;
        let props = this.props;
        let editEdges = this.editEdges;
        let listenerCoordinateSave = Graph.saveCoordinates.bind(this);

        graph.listen('click', (e) => this.edgeListenerImpl(e, state, props, editEdges, listenerCoordinateSave));
    }

    editEdges(state, tag, props) {
        //check that if coords change dont do edge logic
        for (let node of state.graphData.nodes) {
            let graphNode = graph.da.find(n => n.id === node.id);

            if (graphNode && graphNode.position && (node.x !== graphNode.position.x || node.y !== graphNode.position.y)) {
                return;
            }
        }

        if (fromNode) {
            if (fromNode !== tag.id)  {
                let edges = state.graphData.edges;
                if (edges.filter(edge => edge.from === fromNode).filter(edge => edge.to === tag.id).length > 0) {
                    props.addBanner({
                        msg: `Edge already exists between ${fromNode} and ${tag.id}, you can double click the edge to delete it.`,
                        type: 'failure'
                    });
                } else if (edges.filter(edge => edge.from === tag.id).filter(edge => edge.to === fromNode).length > 0) {
                    props.addBanner({
                        msg: `An edge between ${fromNode} and ${tag.id} already exists.`,
                        type: 'failure'
                    });
                } else {
                    props.addEdge({
                        from: fromNode,
                        to: tag.id
                    });

                    props.addBanner({
                        msg: `Edge added from ${fromNode} to ${tag.id}`,
                        type: 'success'
                    });
                }
            } else {
                props.addBanner({
                    msg: `Unselected node ${fromNode}`,
                    type: 'success'
                });
            }

            fromNode = null;
        } else {
            fromNode = tag.id;
            props.addBanner({
                msg: `Selected node ${fromNode}`,
                type: 'success'
            });
        }
    }

    render() {
        graph = anychart.graph();

        graph.contextMenu(false);
        this.setNodeLabels(graph.nodes());
        this.setNodeAppearance(graph.nodes());
        this.setArrows(graph.edges());
        this.setZoom();
        this.setTooltip();
        this.editNodeListener();
        this.edgeListener();
        this.deleteEdgeListener();
        graph.layout().type('fixed');

        return <AnyChart
            id='graphCanvas'
            instance={graph}
            data={this.state.graphData}
        />;
    }
}

export function testSetPrevEdgeState() {
    prevEdgeState = {}
}

export function testUnsetPrevEdgeState() {
    prevEdgeState = null;
}

export function testSetFromNode(value) {
    fromNode = value;
}

export function testSetGraph(value) {
    graph = value;
}

export default Graph;