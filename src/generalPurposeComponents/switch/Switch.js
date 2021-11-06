import React from 'react';
import InternalSwitch from "react-switch";

class Switch extends React.Component {
    render() {
        return <div id={this.props.title + '-switch'}>
            <label>
                <InternalSwitch
                    checked={this.props.isChecked}
                    onChange={this.props.onChange}
                />
                {this.props.title}
            </label>
        </div>
    }
}

export default Switch;