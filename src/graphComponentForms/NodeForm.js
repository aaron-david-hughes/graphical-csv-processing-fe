import React from 'react';
import Input from "../generalPurposeComponents/input/Input";
import Validation from "./validation/Validation";

class NodeForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.setOperationDependantState();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showNotStartedErrors) {
            let obj = state.inputValidity;

            for (const [key, value] of Object.entries(obj)) {
                if (value === 'notStarted') {
                    obj[key] = 'invalid';
                }
            }

            return {
                ...state,
                inputValidity: obj
            }
        }
        return null;
    }

    setOperationDependantState() {
        let validity = this.props.showNotStartedErrors ? 'invalid' : 'notStarted';

        switch (this.props.operation) {
            case 'openFile':
                return {
                    nodeObj: {
                        ...fileNodeConfig,
                        group: 'file',
                        operation: 'open_file',
                        name: null
                    },
                    inputValidity: {
                        name: validity
                    }
                };
            case 'join':
                return {
                    nodeObj: {
                        ...processingNodeConfig,
                        group: 'processing',
                        operation: 'join',
                        onLeft: null,
                        onRight: null,
                        joinType: 'left',
                    },
                    inputValidity: {
                        onLeft: validity,
                        onRight: validity
                    }
                };
            case 'filter':
                return {
                    nodeObj: {},
                    inputValidity: {}
                };
            default:
                return {
                    nodeObj: {},
                    inputValidity: {}
                };
        }
    }

    setNodeObjKey(key, value) {
        this.setState({
            nodeObj: {
                ...this.state.nodeObj,
                [key]: value
            }
        });
    }

    //redo - buggy as hell
    setInputValidity(id, isValid) {
        this.setState({
            inputValidity: {
                ...this.state.inputValidity,
                [id]: isValid
            }
        });
        this.props.setIsFormValid(this.state.inputValidity);
    }

    openFileForm() {
        return <div
            id='openFileNodeForm'
            style={{
                width: '100%'
            }}
        >
            <div
                style={{
                    display: 'inline-flex',
                    width: '100%'
                }}
            >
                <Input
                    errorText='Please supply a csv file.'
                    title='File'
                    isInvalid={this.state.inputValidity.name === 'invalid'}
                    style={{width: '50%'}}
                    required={true}
                    input={
                        <input
                            id='fileInput'
                            type='file'
                            accept='text/csv'
                            onChange={async e => {
                                await this.setNodeObjKey('name', this.props.getFileAndName(e));
                                this.props.setNodeTemplate(this.state.nodeObj);
                                this.setInputValidity('name', 'valid')
                            }}
                        />
                    }
                />
            </div>
        </div>
    }

    joinForm() {
        return <div
            id='joinNodeForm'
            style={{
                width: '100%'
            }}
        >
            <div
                style={{
                    display: 'inline-flex',
                    width: '100%'
                }}
            >
                <Input
                    errorText='Please fill in this field.'
                    title='On Left'
                    isInvalid={this.state.inputValidity.onLeft === 'invalid'}
                    style={{width: '50%'}}
                    required={true}
                    input={
                        <input
                            id='onLeft'
                            type='text'
                            onBlur={async e => {
                                //validate content and set value if valid
                                if (Validation.validateTextField(e)) {
                                    await this.setNodeObjKey('onLeft', e.target.value)
                                    this.props.setNodeTemplate(this.state.nodeObj);
                                    this.setInputValidity('onLeft', 'valid');
                                } else{
                                    this.setInputValidity('onLeft', 'invalid');
                                }
                            }}
                        />
                    }
                />
                <Input
                    errorText='Please fill in this field.'
                    title='On Right'
                    isInvalid={this.state.inputValidity.onRight === 'invalid'}
                    style={{width: '50%'}}
                    required={true}
                    input={
                        <input
                            id='onRight'
                            type='text'
                            onBlur={async e => {
                                //validate content and set value if valid
                                if (Validation.validateTextField(e)) {
                                    await this.setNodeObjKey('onRight', e.target.value)
                                    this.props.setNodeTemplate(this.state.nodeObj);
                                    this.setInputValidity('onRight', 'valid');
                                } else{
                                    this.setInputValidity('onRight', 'invalid');
                                }
                            }}
                        />
                    }
                />
            </div>
            <div
                style={{
                    display: 'inline-flex',
                    width: '100%'
                }}
            >
                <Input
                    title='Join Type'
                    style={{width: '100%'}}
                    required={true}
                    input={
                        <select
                            id='joinType'
                            style={{
                                width: '100%',
                                padding: '1px 2px'
                            }}
                            value={this.state.nodeObj.joinType}
                            onChange={async e => {
                                //validate content and set value if valid
                                if (Validation.validateTextField(e)) {
                                    await this.setNodeObjKey('joinType', e.target.value);
                                    this.props.setNodeTemplate(this.state.nodeObj);
                                }
                            }}
                        >
                            {
                                NodeList.find(x => x.id === 'join').type.map(function(type) {
                                    return <option key={type} value={type}>
                                        {type}
                                    </option>
                                })
                            }
                        </select>
                    }
                />
            </div>
        </div>
    }

    renderFormContent() {
        switch(this.props.operation) {
            case 'openFile':
                return this.openFileForm();
            case 'join':
                return this.joinForm();
            case 'filter':
                return <div/>
            default:
                return <div/>
        }
    }

    render() {
        return <div>
            {this.renderFormContent()}
        </div>
    }
}

export const NodeList = [
    {
        id: 'openFile',
        name: 'Open File'
    },
    {
        id: 'join',
        name: 'Join',
        type: [
            'left',
            'right',
            'inner',
            'outer'
        ]
    },
    {
        id: 'filter',
        name: 'Filter'
    }
];

const fileNodeConfig = {
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
};

const processingNodeConfig = {
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
};

export default NodeForm;