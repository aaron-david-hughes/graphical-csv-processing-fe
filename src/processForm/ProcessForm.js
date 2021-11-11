import React from 'react';
import Input from "../generalPurposeComponents/input/Input";

class ProcessForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: DefaultFilename
        }
    }

    //want to allow custom file types but if no . suffix .csv to the title inputted
    setTitle(title) {
        if (title.length <= 0) {
            title = DefaultFilename;
        }

        if (!title.includes('.')) {
            title = title + '.csv';
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
            <div>
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
                <div style={{margin: '5px'}}>
                    <p>
                        <i className='fa fa-info-circle'/>
                        {` Filename to be used: ${this.state.title}`}
                    </p>
                </div>
                <button>Process</button>
            </div>
        </form>
    }
}

const DefaultFilename = 'Result.csv';

export default ProcessForm;