import React from 'react';
import AnyChart from 'anychart-react/dist/anychart-react.min';
import anychart from 'anychart';
import GraphUtils from './graphUtils';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            graphData: props.graphData,
            fromNode: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.graphData !== state.graphData) {
            return {
                ...state,
                graphData: props.graphData
            };
        }
        return null;
    }

    setNodeLabels(nodes) {
        nodes.labels().enabled(true);
        nodes.labels().format('{%operation}');
        nodes.labels().fontSize(12);
        nodes.labels().fontColor('#333333');
        nodes.labels().fontWeight(600);
    }

    setNodeAppearance(nodes) {
        nodes.normal().stroke("#333333", 1);
        nodes.hovered().stroke("#333333", 2);
        nodes.selected().stroke("#333333", 3);

        nodes.normal().height(35);
        nodes.hovered().height(40);
        nodes.selected().height(45);
    }

    setTooltip(chart) {
        let config = this.state.config;

        chart.tooltip().useHtml(true);
        chart.tooltip().format(function() {
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

    setZoom(chart) {
        let zoomController = anychart.ui.zoom();
        zoomController.target(chart);
        zoomController.render();
    }

    addClickListener(chart) {
        let setStep = this.props.setStep;

        //todo: currently rerender loses graph position (store x,y on each node) => not critical but would be nice
        chart.listen('dblClick', function(e) {
            let tag = e.domTarget.tag;

            if (tag) {
                if (tag.type === 'node') {
                    setStep('Edit Node', tag.id);
                }
            }
        });
    }

    deleteEdgeListener(chart) {
        let deleteEdge = this.props.deleteEdge;
        let props = this.props;

        chart.listen('dblClick', function(e) {
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
        });
    }

    edgeListener(chart) {
        let state = this.state;
        let props = this.props;
        let setState = this.setState.bind(this);
        let editEdges = this.editEdges;

        chart.listen('click', function(e) {
            let tag = e.domTarget.tag;

            if (tag && tag.type === 'node') {
                editEdges(state, tag, props, setState);
            }
        });
    }

    editEdges(state, tag, props, setState) {
        if (state.fromNode) {
            if (state.fromNode !== tag.id)  {
                let edges = state.graphData.edges;
                if (edges.filter(edge => edge.from === state.fromNode).filter(edge => edge.to === tag.id).length > 0) {
                    props.addBanner({
                        msg: `Edge already exists between ${state.fromNode} and ${tag.id}, you can double click the edge to delete it.`,
                        type: 'failure'
                    });
                } else if (edges.filter(edge => edge.from === tag.id).filter(edge => edge.to === state.fromNode).length > 0) {
                    props.addBanner({
                        msg: `An edge between ${state.fromNode} and ${tag.id} already exists.`,
                        type: 'warning'
                    });
                } else {
                    props.addEdge({
                        from: state.fromNode,
                        to: tag.id
                    });

                    props.addBanner({
                        msg: `Edge added from ${state.fromNode} to ${tag.id}`,
                        type: 'success'
                    });
                }
            }

            setState({
                fromNode: null
            });
        } else {
            setState({
                fromNode: tag.id
            });
        }
    }

    render() {
        let chart = anychart.graph();

        chart.contextMenu(false);
        this.setNodeLabels(chart.nodes());
        this.setNodeAppearance(chart.nodes());
        this.setTooltip(chart);
        this.setArrows(chart.edges());
        this.setZoom(chart);
        this.addClickListener(chart);
        this.edgeListener(chart);
        this.deleteEdgeListener(chart);
        chart.interactivity(false);

        return <AnyChart
            id='graphCanvas'
            instance={chart}
            data={this.state.graphData}
        />;
    }
}

export default React.memo(Graph);