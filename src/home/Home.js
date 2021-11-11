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
                    // {
                    //     id: '0',
                    //     group: 'file',
                    //     operation: 'open_file',
                    //     name: '',
                    //     normal:   {
                    //         shape: "square",
                    //         fill: "purple",
                    //         stroke: null
                    //     },
                    //     hovered:  {
                    //         shape: "square",
                    //         fill: "purple",
                    //         stroke: "3 #ffa000"
                    //     },
                    //     selected: {
                    //         shape: "square",
                    //         fill: "purple",
                    //         stroke: "3 #ffa000"
                    //     }
                    // },
                    // {
                    //     id: '1',
                    //     group: 'file',
                    //     operation: 'open_file',
                    //     name: '',
                    //     normal:   {
                    //         shape: "square",
                    //         fill: "purple",
                    //         stroke: null
                    //     },
                    //     hovered:  {
                    //         shape: "square",
                    //         fill: "purple",
                    //         stroke: "3 #ffa000"
                    //     },
                    //     selected: {
                    //         shape: "square",
                    //         fill: "purple",
                    //         stroke: "3 #ffa000"
                    //     }
                    // },
                    // {
                    //     id: '2',
                    //     group: 'processing',
                    //     operation: 'join',
                    //     onLeft: 'Attendant',
                    //     onRight: 'StudentNum',
                    //     joinType: 'right',
                    //     normal:   {
                    //         shape: "diamond",
                    //         fill: "turquoise",
                    //         stroke: null
                    //     },
                    //     hovered:  {
                    //         shape: "diamond",
                    //         fill: "turquoise",
                    //         stroke: "3 #ffa000"
                    //     },
                    //     selected: {
                    //         shape: "diamond",
                    //         fill: "turquoise",
                    //         stroke: "3 #ffa000"
                    //     }
                    // }
                ],
                edges: [
                    // {
                    //     from: '0',
                    //     to: '2',
                    //     priority: 'y'
                    // },
                    // {
                    //     from: '1',
                    //     to: '2',
                    //     priority: 'n'
                    // }
                ]
            },
            counter: 0,
            files: [],
            switchTitle: 'CSC1026',
            isCSC1026: false,
            isSettings: false
        }

        //make it so that use of addNode understands this refers to this object
        this.addNode = this.addNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.addFile = this.addFile.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.toggleIsCSC1026 = this.toggleIsCSC1026.bind(this);
        this.openSettings = this.openSettings.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
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

    addEdge(edge) {
        this.setState({
            graphData: {
                nodes: [...this.state.graphData.nodes],
                edges: [...this.state.graphData.edges, {...edge}]
            }
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
        }, filename);
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
                addEdge: this.addEdge,
                addFile: this.addFile,
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