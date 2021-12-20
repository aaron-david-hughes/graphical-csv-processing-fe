import React from 'react';
import {graphicalCsvProcessingAPI} from '../ajax/requests';
// import Cookies from 'js-cookie';
import update from 'immutability-helper';
import './resources/Home.css';
import HomeTemplate from './render';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            graphData: {
                nodes: [],
                edges: []
            },
            banners: [],
            bannerCounter: 0,
            counter: 0,
            edgeCounter: 0,
            files: [],
            switchTitle: 'CSC1026',
            isCSC1026: false,
            isSettings: false,
            step: 'Node Type',
            editingId: -1
        }

        //make it so that use of addNode understands this refers to this object
        this.addNode = this.addNode.bind(this);
        this.editNode = this.editNode.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.deleteEdge = this.deleteEdge.bind(this);
        this.addBanner = this.addBanner.bind(this);
        this.removeBanner = this.removeBanner.bind(this);
        this.addFile = this.addFile.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.toggleIsCSC1026 = this.toggleIsCSC1026.bind(this);
        this.openSettings = this.openSettings.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
        this.setStep = this.setStep.bind(this);
    }

    addNode(node) {
        this.setState({
            graphData: {
                nodes: [...this.state.graphData.nodes, {id: `${this.state.counter}`, x: 0, y: 0, ...node}],
                edges: [...this.state.graphData.edges]
            },
            counter: this.state.counter + 1
        });
    }

    //todo: definitely some bugs here... look into this
    editNode(node) {
        let idx = this.state.graphData.edges.findIndex(id => node.id === id);
        let newNodes = update(this.state.graphData.nodes, {$splice: [[idx, 1, node]]})
        this.setState({
            graphData: {
                nodes: newNodes,
                edges: [...this.state.graphData.edges]
            }
        });
    }

    deleteNode(nodeId) {
        this.setState({
            graphData: {
                nodes: this.state.graphData.nodes.filter((graphNode) => {
                    return graphNode.id !== nodeId
                }),
                edges: this.state.graphData.edges.filter((graphEdge) => {
                    return graphEdge.from !== nodeId && graphEdge.to !== nodeId
                })
            }
        });
    }

    addEdge(edge) {
        this.setState({
            graphData: {
                nodes: [...this.state.graphData.nodes],
                edges: [...this.state.graphData.edges, {id: `${this.state.edgeCounter}`, ...edge}]
            },
            edgeCounter: this.state.edgeCounter + 1
        });
    }

    deleteEdge(edgeId) {
        this.setState({
            graphData: {
                nodes: [...this.state.graphData.nodes],
                edges: this.state.graphData.edges.filter((graphEdge) => {
                    return graphEdge.id !== edgeId
                })
            }
        });
    }

    addBanner(banner) {
        this.setState({
            banners: [...this.state.banners, {id: this.state.bannerCounter, ...banner}],
            bannerCounter: this.state.bannerCounter + 1
        });
    }

    removeBanner(bannerId) {
        this.setState({
            banners: this.state.banners.filter((banner) => {
                return banner.id !== bannerId
            })
        });
    }

    addFile(file) {
        this.setState({
            files: [...this.state.files, file]
        });
    }

    onSubmitForm(e, filename) {
        e.preventDefault();
        graphicalCsvProcessingAPI({
            files: this.state.files,
            graphData: this.state.graphData
        }, filename, this.addBanner);
    }

    toggleIsCSC1026() {
        this.setState({
            isCSC1026: !this.state.isCSC1026
        });
    }

    openSettings() {
        this.setState({
            isSettings: true
        });
    }

    closeSettings() {
        this.setState({
            isSettings: false
        });
    }

    setStep(step, id) {
        if (id) {
            this.setState({
                step,
                editingId: id
            });
        } else {
            this.setState({
                step,
                editingId: -1
            });
        }
    }

    render() {
        return HomeTemplate(
            {
                ...this.props,
                addNode: this.addNode,
                editNode: this.editNode,
                deleteNode: this.deleteNode,
                addEdge: this.addEdge,
                deleteEdge: this.deleteEdge,
                addBanner: this.addBanner,
                removeBanner: this.removeBanner,
                addFile: this.addFile,
                onSubmitForm: this.onSubmitForm,
                toggleIsCSC1026: this.toggleIsCSC1026,
                openSettings: this.openSettings,
                closeSettings: this.closeSettings,
                setStep: this.setStep
            },
            this.state
        );
    }
}

export default Home;