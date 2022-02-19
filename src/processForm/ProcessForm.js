import React from 'react';
import Input from "../generalPurposeComponents/input/Input";
import ClipLoader from "react-spinners/ClipLoader"

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
            onSubmit={async e => {
                await this.props.loading(true);
                this.props.onSubmitForm(e, this.state.title);
            }}
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
                {
                    this.props.isLoading
                        ? <ClipLoader loading={this.props.isLoading} size={30} />
                        : <button
                            id='processButton'
                            title='process'
                            disabled={!this.props.isGraphValid()}
                        >
                            process
                        </button>
                }
            </div>
        </form>
    }
}

const DefaultFilename = 'Result.zip';

export default ProcessForm;