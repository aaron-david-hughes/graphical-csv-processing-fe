import React from 'react';
import Input from "../generalPurposeComponents/input/Input";

class ProcessForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: DefaultFilename
        }
    }

    setTitle(title) {
        if (title.length <= 0) {
            title = DefaultFilename;
        }

        if (!title.endsWith('.zip')) {
            title = title + '.zip';
        }

        this.setState({
            title
        });
    }

    render() {
        return <form
            id='processForm'
            style={{
                width: '100%'
            }}
            onSubmit={e => this.props.onSubmitForm(e, this.state.title)}
        >
            <div
                style={{
                    width: '100%'
                }}
            >
                <div
                    style={{
                        width: '100%',
                        display: 'inline-flex'
                    }}
                >
                    <Input
                        title='Filename'
                        style={{width: '100%'}}
                        input={
                            <input
                                id='filename'
                                type='text'
                                onChange={e => this.setTitle(e.target.value)}
                            />
                        }
                    />
                </div>
                <div style={{margin: '5px'}}>
                    <p className='ow'>
                        <i className='fa fa-info-circle'/>
                        {` Filename to be used: ${this.state.title}`}
                    </p>
                </div>
                <button>Process</button>
            </div>
        </form>
    }
}

const DefaultFilename = 'Result.zip';

export default ProcessForm;