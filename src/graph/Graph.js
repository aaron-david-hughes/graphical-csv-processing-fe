import React from 'react';
import AnyChart from 'anychart-react/dist/anychart-react.min';
import anychart from 'anychart';
import GraphUtils from './graphUtils';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            graphData: props.graphData
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
        nodes.labels().format('{%id}');
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
        chart.tooltip().useHtml(true);
        chart.tooltip().format(function() {
            if (this.type === 'node') {
                switch(this.getData('operation')) {
                    case 'open_file':
                        return GraphUtils.openFileTooltip(this);
                    case 'join':
                        return GraphUtils.joinTooltip(this);
                    case 'filter':
                        return GraphUtils.filterTooltip(this);
                    default:
                        break;
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

    render() {
        let chart = anychart.graph();

        // chart.title('Processing Plan');
        chart.contextMenu(false);
        this.setNodeLabels(chart.nodes());
        this.setNodeAppearance(chart.nodes());
        this.setTooltip(chart);
        this.setArrows(chart.edges());
        this.setZoom(chart);

        return <AnyChart
            id='graphCanvas'
            instance={chart}
            data={this.state.graphData}
        />;
    }
}

export default Graph;