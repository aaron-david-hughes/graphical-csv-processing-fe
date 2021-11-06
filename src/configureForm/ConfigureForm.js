import React from 'react';

class ConfigureForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isComplete: true,
            graphData: props.graphData
        }
    }

    //this will be the inputting of files / join on / filter condition etc configuring form
    //it will also be the place where the process button lives to send request to backend api

    //will have an only visible when node clicked on section for each node
    //for now however will simply implement form needed for initial contact with backend api
    //might scrap idea of needing to click on each node and implement with all configs available - will discuss

    //ready for first attempted reach out to api
    render() {
        return <form id='configurationForm' onSubmit={this.props.onSubmitForm}>
            <div id='0'>
                <input
                    id='0-input'
                    type='file'
                    accept='text/csv'
                    required
                    onChange={e => this.props.nodeFileName(e)}
                />
            </div>

            <div id='1'>
                <input
                    id='1-input'
                    type='file'
                    accept='text/csv'
                    required
                    onChange={e => this.props.nodeFileName(e)}
                />
            </div>

            <div id='2'>
                <p>Hola i am also here</p>
            </div>

            <input type='submit' value='Process Graph' disabled={!this.state.isComplete} />
        </form>
    }
}

export default ConfigureForm;