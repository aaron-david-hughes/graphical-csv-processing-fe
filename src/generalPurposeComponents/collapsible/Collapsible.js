import React from 'react';
import TitleBox from "../titleBox/TitleBox";

class Collapsible extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: props.title,
            open: props.open ? props.open : true,
            id: props.id
        }

        this.changeOpenState = this.changeOpenState.bind(this);
    }

    changeOpenState() {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        return <TitleBox
            id={this.props.id + '-collapsible'}
            style={this.props.style}
            isCollapsible={this.changeOpenState}
            open={this.state.open}
            title={this.state.title}
            icon={
                <i
                    className={this.state.open ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}
                    style={{
                        fontSize: '24px',
                        color: 'darkslategray'
                    }}
                />
            }
            iconTitle={this.state.open ? 'Close' : 'Expand'}
        >
            {this.props.children}
        </TitleBox>
    }
}

export default Collapsible;