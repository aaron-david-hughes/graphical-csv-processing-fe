import React from 'react';
import Input from "../generalPurposeComponents/input/Input";
import Validation from "./validation/Validation";

class EdgeForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            graphData: props.graphData,
            edgeObj: {
                from: props.graphData.nodes[0] ? props.graphData.nodes[0].id : null,
                to: props.graphData.nodes[1] ? props.graphData.nodes[1].id : null,
                priority: 'n'
            },
            inputValidity: {
                isValid: null
            }
        }

        this.state.inputValidity.isValid = Validation.validateEdgePairing(this.state.edgeObj, this.state.graphData.edges);
        this.props.setIsFormValid(this.state.inputValidity);
        this.props.setEdgeTemplate(this.state.edgeObj);
    }

    setEdgeObjKey(key, value) {
        this.setState({
            edgeObj: {
                ...this.state.edgeObj,
                [key]: value
            }
        });
    }

    setInputValidity(isValid) {
        this.setState({
            inputValidity: {
                isValid: isValid
            }
        });
        this.props.setIsFormValid(this.state.inputValidity);
    }

    async onEdgeChange(key, value) {
        await this.setEdgeObjKey(key, value);
        this.props.setEdgeTemplate(this.state.edgeObj);
        this.setInputValidity(
            Validation.validateEdgePairing(this.state.edgeObj, this.state.graphData.edges)
        );
    }

    edgeDropdown(key) {
        return  <div
            style={{
                display: 'inline-flex',
                width: '100%'
            }}
        >
            <Input
                title={key.substring(0, 1).toUpperCase() + key.substring(1, key.length).toLowerCase()}
                style={{width: '100%'}}
                required={true}
                input={
                    <select
                        id={key}
                        style={{
                            width: '100%',
                            padding: '1px 2px'
                        }}
                        value={this.state.edgeObj[key]}
                        onChange={async e => {
                            await this.onEdgeChange(key, e.target.value)
                        }}
                    >
                        {
                            this.state.graphData.nodes.map(function(node) {
                                return <option
                                    key={node.id}
                                    value={node.id}
                                >
                                    {node.id + ': ' + node.operation}
                                </option>
                            })
                        }
                    </select>
                }
            />
        </div>
    }

    joinPriority() {
        return this.state.edgeObj.to != null
            && this.state.graphData.nodes.find(x => x.id === this.state.edgeObj.to).operation === 'join'
            && this.state.inputValidity.isValid === 'valid'
            ? <div
                style={{
                    display: 'inline-flex',
                    width: '100%'
                }}
            >
                <Input
                    title='Priority'
                    style={{width: '100%'}}
                    required={true}
                    input={
                        <input
                            id='priority edge'
                            type='checkbox'
                            style={{width: 'unset'}}
                            onChange={async e => {
                                await this.onEdgeChange('priority', e.target.checked ? 'y' : 'n');
                            }}
                        />
                    }
                />
            </div>
            : null;
    }

    //now want to stop edges where the opposite edge exists and edges between same node as well
    edgeWarning() {
        return this.state.inputValidity.isValid !== 'valid'
            ? <div
                style={{
                    display: 'inline-flex',
                    width: '100%'
                }}
            >
                <p
                    style={{
                        textAlign: 'right',
                        margin: '3px',
                        fontSize: '12px',
                        color: 'red',
                        width: '100%'
                    }}
                >
                    <i className='fa fa-exclamation-circle'/>
                    {' ' + this.state.inputValidity.isValid}
                </p>
            </div>
            : null;
    }

    renderForm() {
        return <div
            id='edgeForm'
            style={{
                width: '100%'
            }}
        >
            {this.edgeDropdown('from')}
            {this.edgeDropdown('to')}
            {this.joinPriority()}
            {this.edgeWarning()}
        </div>
    }

    render() {
        return <div>
            {
                this.state.graphData.nodes.length > 1
                ? this.renderForm()
                : <p id='edgeFormNotAvailable'>Must be 2 or more nodes before an edge can be drawn</p>
            }
        </div>
    }
}

export default EdgeForm;