import React from 'react';
import TitleBox from "../titleBox/TitleBox";

class Popup extends React.Component {
    render() {
        return <div
            className='popup'
            style={{
                display: this.props.isOpen ? 'block' : 'none',
                width: '100%',
                height: '100%'
            }}
        >
            <div
                id='backgroundCover'
                onClick={this.props.close}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, .5)',
                    position: 'fixed',
                    top: '0',
                }}
            />

            <TitleBox
                id={this.props.id}
                title={this.props.title}
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    top: `calc(50% - 0.5 * ${this.props.height})`,
                    left: `calc(50% - 0.5 * ${this.props.width})`,
                    position: 'fixed'
                }}
                open={true}
                icon={
                    <i
                        className='fa fa-times'
                        style={{
                            fontSize: '24px',
                            color: 'darkslategray'
                        }}
                    />
                }
                iconOnClick={this.props.close}
                iconTitle='Close'
            >
                {this.props.children}
            </TitleBox>
        </div>
    }
}

export default Popup;