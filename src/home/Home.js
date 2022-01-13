import React from 'react';
import {graphicalCsvProcessingAPI, saveFile} from '../ajax/requests';
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
            isSettings: false,
            editingNode: null,
            saveGraphFilename: 'SaveGraph.json',
            savePopup: false,
            loadPopup: false,
            graphValid: true,
            invalidNodes: []
        }
    }

    addNode(node) {
        this.setState({
            graphData: {
                nodes: [...this.state.graphData.nodes, {id: `${this.state.counter}`, ...node}],
                edges: [...this.state.graphData.edges]
            },
            counter: this.state.counter + 1
        });
    }

    setEditNode(id) {
        this.setState({
            editingNode: this.state.graphData.nodes.find(node => node.id === id)
        });
    }

    unsetEditNode() {
        this.setState({
            editingNode: null
        });
    }

    //todo: definitely some bugs here... look into this
    editNode(node) {
        let graphData = this.state.graphData;
        let idx = graphData.nodes.findIndex(n => node.id === n.id);
        graphData.nodes[idx] = node;

        this.setState({
            graphData
        });

        console.log(this.state.graphData);
    }

    async deleteNode(nodeId) {
        let relatedEdges = this.state.graphData.edges.filter(edge => edge.from === nodeId || edge.to === nodeId);

        for (let edge of relatedEdges) {
            await this.deleteEdge(edge.id);
        }

        this.setState({
            graphData: {
                nodes: this.state.graphData.nodes.filter((graphNode) => {
                    return graphNode.id !== nodeId
                }),
                edges: this.state.graphData.edges
            }
        });
    }

    addEdge(edge) {
        let nodes = this.state.graphData.nodes;
        let from = nodes.find(node => edge.from === node.id);
        let to = nodes.find(node => edge.to === node.id);

        from.outputCardinality = from.outputCardinality + 1;
        to.inputCardinality = to.inputCardinality + 1;

        this.setState({
            graphData: {
                nodes: [...nodes],
                edges: [...this.state.graphData.edges, {id: `${this.state.edgeCounter}`, ...edge}]
            },
            edgeCounter: this.state.edgeCounter + 1
        });
    }

    deleteEdge(edgeId) {
        let nodes = this.state.graphData.nodes;
        let edge = this.state.graphData.edges.find(e => e.id === edgeId);
        let from = nodes.find(node => edge.from === node.id);
        let to = nodes.find(node => edge.to === node.id);

        from.outputCardinality = from.outputCardinality - 1;
        to.inputCardinality = to.inputCardinality - 1;

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

    removeFile(filename) {
        this.setState({
            files: this.state.files.filter(file => file.name !== filename)
        })
    }

    onSubmitForm(e, filename) {
        e.preventDefault();
        graphicalCsvProcessingAPI({
            files: this.state.files,
            graphData: this.state.graphData
        }, filename, this.addBanner.bind(this), this.state.config.backend);
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

    switchSavePopup() {
        this.setState({
            savePopup: !this.state.savePopup,
            saveGraphFilename: 'SaveGraph.json'
        });
    }

    switchLoadPopup() {
        this.setState({
            loadPopup: !this.state.loadPopup
        });
    }

    setSaveGraphFilename(saveGraphFilename) {
        if (saveGraphFilename.length <= 0) {
            saveGraphFilename = 'SaveGraph.json';
        }

        if (!saveGraphFilename.endsWith('.json')) {
            saveGraphFilename = saveGraphFilename + '.json';
        }

        this.setState({
            saveGraphFilename
        });
    }

    canSaveGraph() {
        return !!this.state.graphValid;
    }

    saveGraphWithConfig(filename) {
        let save = {};
        let state = this.state;

        save.type = 1;
        save.graphData = this.state.graphData;
        save.counter = this.state.counter;
        save.edgeCount = this.state.edgeCounter;
        save.files = {};

        for (let file of this.state.files) {
            if (file.name && file.file) {
                let reader = new FileReader();
                reader.readAsDataURL(file.file);

                reader.onload = () => {
                    save.files[file.name] = reader.result;

                    if (Object.entries(save.files).length === state.files.length) {
                        saveFile(
                            new Blob([JSON.stringify(save)], {type: 'application/json'}),
                            filename
                        );
                        this.switchSavePopup();
                    }
                }
            }
        }
    }

    saveGraphConfigTemplate(filename) {
        if (this.state.graphData.nodes.length > 0) {
            let save = {};

            save.type = 2;
            save.graphData = this.state.graphData;
            save.counter = this.state.counter;
            save.edgeCounter = this.state.edgeCounter;

            for (let node of save.graphData.nodes) {
                if (node.operation === 'open_file') this.stripConfig(node);
            }

            saveFile(
                new Blob([JSON.stringify(save)], {type: 'application/json'}),
                filename
            );
            this.switchSavePopup();
        }
    }

    saveGraphTemplate(filename) {
        if (this.state.graphData.nodes.length > 0) {
            let save = {};

            save.type = 3;
            save.graphData = this.state.graphData;
            save.counter = this.state.counter;
            save.edgeCounter = this.state.edgeCounter;

            for (let node of save.graphData.nodes) {
                this.stripConfig(node);
            }

            saveFile(
                new Blob([JSON.stringify(save)], {type: 'application/json'}),
                filename
            );
            this.switchSavePopup();
        }
    }

    stripConfig(node) {
        if (node.group === 'file') node.name = null;
        else {
            let template = this.state.config.processing.operations
                .find(op => op.operation === node.operation).template;

            for (let entry of Object.entries(template)) {
                if (entry[0] !== 'operation') node[entry[0]] = null;
            }
        }
    }

    async loadGraph(e) {
        let id = e.target.id;
        let element = document.getElementById(id);

        if (element && element.files && element.files.item(0)) {
            let text = await element.files.item(0).text();
            let loadGraph = JSON.parse(text);

            switch (loadGraph.type) {
                case 1:
                    await this.loadGraphWithConfig(loadGraph);
                    break;
                case 2:
                    await this.loadGraphConfigTemplate(loadGraph);
                    break;
                case 3:
                    await this.loadTemplate(loadGraph);
                    break;
                default:
                    console.log('general log')
                    this.addBanner({
                        msg: 'Cannot load graph',
                        type: 'failure'
                    });
            }

            this.switchLoadPopup();
        }
    }

    async loadGraphWithConfig(loadGraph) {
        console.log(loadGraph)
        if (
            loadGraph.files && Object.entries(loadGraph.files).length > 0 &&
            loadGraph.graphData &&
            loadGraph.counter &&
            loadGraph.edgeCounter
        ) {
            let files = [];

            for (let [key, value] of Object.entries(loadGraph.files)) {
                let file = await this.dataUrlToFile(value, key)
                files.push({
                    file: file,
                    name: key
                });
            }

            this.clearGraph();

            this.setState({
                graphValid: true,
                counter: loadGraph.counter,
                edgeCounter: loadGraph.edgeCounter,
                graphData: loadGraph.graphData,
                invalidNodes: [],
                files
            });
        } else {
            console.log('specific config load')
            this.addBanner({
                msg: 'Cannot load graph',
                type: 'failure'
            });
        }
    }

    //will be used on loading
    async dataUrlToFile(dataUrl, fileName) {
        console.log(dataUrl);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], fileName, {type: 'text/csv'});
    }

    async loadGraphConfigTemplate(loadGraph) {
        if (
            loadGraph.graphData &&
            loadGraph.counter &&
            loadGraph.edgeCounter
        ) {
            let invalidNodeIds = loadGraph.graphData.nodes
                .filter(node => node.operation === 'open_file')
                .map(node => node.id);

            this.clearGraph();

            this.setState({
                graphValid: false,
                counter: loadGraph.counter,
                edgeCounter: loadGraph.edgeCounter,
                graphData: loadGraph.graphData,
                invalidNodes: invalidNodeIds
            });
        } else {
            this.addBanner({
                msg: 'Cannot load graph',
                type: 'failure'
            });
        }
    }

    async loadTemplate(loadGraph) {
        if (
            loadGraph.graphData &&
            loadGraph.counter &&
            loadGraph.edgeCounter
        ) {
            let nodeIds = loadGraph.graphData.nodes.map(node => node.id);

            this.clearGraph();

            this.setState({
                graphValid: false,
                counter: loadGraph.counter,
                edgeCounter: loadGraph.edgeCounter,
                graphData: loadGraph.graphData,
                invalidNodes: nodeIds
            });
        } else {
            this.addBanner({
                msg: 'Cannot load graph',
                type: 'failure'
            });
        }
    }

    setValidNode(id) {
        let invalidNodes = this.state.invalidNodes.filter(i => i !== id);
        this.setState({
            invalidNodes,
            graphValid: invalidNodes.length === 0
        });
    }

    clearGraph() {
        this.setState({
            files: [],
            graphData: {
                nodes: [],
                edges: []
            },
            counter: 0,
            edgeCounter: 0,
            graphValid: true,
            invalidNodes: []
        })
    }

    render() {
        return HomeTemplate(
            {
                ...this.props,
                addNode: this.addNode.bind(this),
                setEditNode: this.setEditNode.bind(this),
                unsetEditNode: this.unsetEditNode.bind(this),
                editNode: this.editNode.bind(this),
                deleteNode: this.deleteNode.bind(this),
                addEdge: this.addEdge.bind(this),
                deleteEdge: this.deleteEdge.bind(this),
                addBanner: this.addBanner.bind(this),
                removeBanner: this.removeBanner.bind(this),
                addFile: this.addFile.bind(this),
                removeFile: this.removeFile.bind(this),
                onSubmitForm: this.onSubmitForm.bind(this),
                openSettings: this.openSettings.bind(this),
                closeSettings: this.closeSettings.bind(this),
                switchSavePopup: this.switchSavePopup.bind(this),
                switchLoadPopup: this.switchLoadPopup.bind(this),
                setSaveGraphFilename: this.setSaveGraphFilename.bind(this),
                canSaveGraph: this.canSaveGraph.bind(this),
                saveGraphWithConfig: this.saveGraphWithConfig.bind(this),
                saveGraphTemplate: this.saveGraphTemplate.bind(this),
                saveGraphConfigTemplate: this.saveGraphConfigTemplate.bind(this),
                loadGraph: this.loadGraph.bind(this),
                setValidNode: this.setValidNode.bind(this),
                clearGraph: this.clearGraph.bind(this)
            },
            this.state
        );
    }
}

export default Home;