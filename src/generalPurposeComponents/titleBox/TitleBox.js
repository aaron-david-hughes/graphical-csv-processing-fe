import React from 'react';

class TitleBox extends React.Component {

    render() {
        return <div
            id={this.props.id}
            style={this.props.style}
        >
            <div
                id={this.props.id + '-header'}
                onClick={this.props.isCollapsible}
                style={{
                    display: 'inline-flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    border: '2px solid darkslategray',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    borderBottom: this.props.open ? '0px' : '2px solid darkslategray',
                    borderBottomLeftRadius: this.props.open ? '0px' : '10px',
                    borderBottomRightRadius: this.props.open ? '0px' : '10px',
                    backgroundColor: 'white'
                }}
            >
                <h3 style={{marginLeft: '1rem'}}>{this.props.title}</h3>
                {
                    this.props.icon
                    ? <button
                        style={{
                            border: 'none'
                        }}
                        onClick={this.props.iconOnClick}
                        title={this.props.iconTitle}
                    >
                        {this.props.icon}
                    </button>
                    : null
                }
            </div>
            <div
                id={this.props.id + '-body'}
                style={{
                    display: this.props.open ? 'block' : 'none',
                    width: '100%',
                    border: '2px solid darkslategray',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    backgroundColor: 'white',
                }}
            >
                <div style={{margin: '1rem'}}>
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}

export default TitleBox;