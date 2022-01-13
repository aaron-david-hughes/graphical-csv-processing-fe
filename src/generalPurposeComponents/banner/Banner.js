import React from 'react';

class Banner extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            msg: props.msg,
            color: props.color,
            timeToLive: props.timeToLive
        }
    }

    componentDidMount() {
        setTimeout(() => this.props.removeBanner(this.state.id), this.state.timeToLive);
    }

    render() {
        let backgroundColor;
        let borderColor;

        switch(this.props.type) {
            case 'success':
                borderColor = 'green';
                backgroundColor = '#ccffcc';
                break;
            case 'failure':
                borderColor = 'darkred';
                backgroundColor = '#ffcccc';
                break;
            case 'warning':
                borderColor = 'darkorange';
                backgroundColor = '#ffe3b3';
                break;
            case 'neutral':
            default:
                borderColor = 'black';
                backgroundColor = '#bfbfbf';
        }

        return <div
            style={{
                width: '100%',
                height: '5%',
                backgroundColor: backgroundColor,
                color: borderColor,
                textAlign: 'center',
                border: `1px solid ${borderColor}`
            }}
        >
            <p
                style={{
                    margin: 'unset',
                    padding: '5px'
                }}
            >
                {this.state.msg}
            </p>
        </div>
    }
}

export default Banner;