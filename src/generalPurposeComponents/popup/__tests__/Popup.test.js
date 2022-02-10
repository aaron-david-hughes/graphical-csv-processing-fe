import React from 'react';
import {shallow} from 'enzyme';
import Popup from "../Popup";

describe('Popup tests', () => {
    let props = {
        close: jest.fn(),
        isOpen: true,
        id: 'testPopupId',
        title: 'testPopupTitle',
        height: '10px',
        width: '10px',
        children: 'titleBoxContent'
    };

    let render;

    beforeEach(() => {
        render = shallow(<Popup {...props} />);
    });

    describe('Popup render tests', () => {
        it('matches the snapshot when open', () => {
            expect(render).toMatchSnapshot();
        });

        it('matches the snapshot when closed', () => {
            render = shallow(<Popup {...props} isOpen={false} />);

            expect(render).toMatchSnapshot();
        });

        it('should call the close function when click occurs elsewhere on DOM', () => {
            render.find('#backgroundCover').simulate('click');

            expect(props.close).toHaveBeenCalled();
        });
    });
});
