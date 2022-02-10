import React from 'react';

class Input extends React.Component {

    render() {
        console.log(this.props.input);
        return <div
            id={this.props.input.props.id + '-inputDiv'}
            style={this.props.isInvalid
                ? {...this.props.style, borderColor: 'red !important', color: 'red'}
                : {...this.props.style}
            }
        >
            <label
                htmlFor={this.props.input.props.id}
                style={{display: 'block'}}
            >
                {this.props.title + (this.props.required ? '*' : '')}
            </label>
            {this.props.input}
            {
                this.props.isInvalid
                    ? <p
                        style={{
                            textAlign: 'right',
                            margin: '3px',
                            fontSize: '12px'
                        }}
                    >
                        <i className='fa fa-exclamation-circle'/>
                        {' ' + this.props.errorText}
                    </p>
                    : null
            }
        </div>
    }
}

export default Input;