import React from 'react';
import {graphicalCsvProcessingAPI} from '../ajax/requests';
import Cookies from 'js-cookie';
import './resources/Home.css';
import HomeTemplate from './HomeTemplate';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            graphData: {
                nodes: [
                    {
                        id: '0',
                        group: 'file',
                        operation: 'open_file',
                        name: '',
                        normal:   {
                            shape: "square",
                            fill: "purple",
                            stroke: null
                        },
                        hovered:  {
                            shape: "square",
                            fill: "purple",
                            stroke: "3 #ffa000"
                        },
                        selected: {
                            shape: "square",
                            fill: "purple",
                            stroke: "3 #333333"
                        }
                    },
                    {
                        id: '1',
                        group: 'file',
                        operation: 'open_file',
                        name: '',
                        normal:   {
                            shape: "square",
                            fill: "purple",
                            stroke: null
                        },
                        hovered:  {
                            shape: "square",
                            fill: "purple",
                            stroke: "3 #ffa000"
                        },
                        selected: {
                            shape: "square",
                            fill: "purple",
                            stroke: "3 #ffa000"
                        }
                    },
                    {
                        id: '2',
                        group: 'processing',
                        operation: 'join',
                        onLeft: 'Attendant',
                        onRight: 'StudentNum',
                        joinType: 'right',
                        normal:   {
                            shape: "diamond",
                            fill: "turquoise",
                            stroke: null
                        },
                        hovered:  {
                            shape: "diamond",
                            fill: "turquoise",
                            stroke: "3 #ffa000"
                        },
                        selected: {
                            shape: "diamond",
                            fill: "turquoise",
                            stroke: "3 #ffa000"
                        }
                    }
                ],
                edges: [
                    {
                        from: '0',
                        to: '2',
                        priority: 'y'
                    },
                    {
                        from: '1',
                        to: '2',
                        priority: 'n'
                    }
                ]
            },
            counter: 3,
            files: [],
            switchTitle: 'CSC1026',
            isCSC1026: false,
            isSettings: false
        }

        //make it so that use of addNode understands this refers to this object
        this.addNode = this.addNode.bind(this);
        this.nodeFileName = this.nodeFileName.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.toggleIsCSC1026 = this.toggleIsCSC1026.bind(this);
        this.openSettings = this.openSettings.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
    }

    //TODO: example on how to edit graphData - this function will likely not be kept long term
    addNode() {
        this.setState({
            graphData: {
                nodes: [...this.state.graphData.nodes, {id: this.state.counter}],
                edges: [...this.state.graphData.edges, {from: this.state.counter - 1, to: this.state.counter}]
            },
            counter: this.state.counter + 1
        });

        Cookies.set('activeGraphData', JSON.stringify(this.state.graphData));
    }

    //will need better way than hoping the id is also the index in the node array!
    /**
     * TODO: make it not sensitive to the order of the nodes in the array
     */
    nodeFileName(e) {
        let id = e.target.id;
        let element = document.getElementById(id);
        let filename = '';

        if (element && element.files && element.files.item(0) && element.files.item(0).name) {
            filename = element.files.item(0).name;
            this.setState({
                files: [...this.state.files, element.files.item(0)]
            })
        }

        let nodeId = id.split('-')[0];

        //edit node with nodeId to have name: filename
        const newNodes = this.state.graphData.nodes.slice();

        newNodes[nodeId] = {
            ...newNodes[nodeId],
            name: filename
        }

        this.setState({
            graphData: {
                nodes: newNodes,
                edges: [...this.state.graphData.edges]
            }
        })
    }

    onSubmitForm(e) {
        e.preventDefault();
        graphicalCsvProcessingAPI({
            files: this.state.files,
            graphData: this.state.graphData
        });
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

    render() {
        return HomeTemplate(
            {
                ...this.props,
                addNode: this.addNode,
                nodeFileName: this.nodeFileName,
                onSubmitForm: this.onSubmitForm,
                toggleIsCSC1026: this.toggleIsCSC1026,
                openSettings: this.openSettings,
                closeSettings: this.closeSettings
            },
            this.state
        );
    }
}

export default Home;