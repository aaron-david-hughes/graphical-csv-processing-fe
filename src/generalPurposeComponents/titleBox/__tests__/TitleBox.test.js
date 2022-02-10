import React from 'react';
import {shallow} from 'enzyme';
import TitleBox from "../TitleBox";

describe('TitleBox component tests', () => {
    let props = {
        id: 'testTitleBoxId',
        style: 'testStyle',
        isCollapsible: true,
        open: true,
        title: 'testTitleBoxTitle',
        icon: 'testIcon',
        iconOnClick: jest.fn(),
        iconTitle: 'testIconTitle',
        children: 'titleBoxContent'
    };

    let render;

    beforeEach(() => {
        render = shallow(<TitleBox {...props} />);
    });

    describe('render tests', () => {
        it('should match open snapshot when open is true', () => {
            expect(render).toMatchSnapshot();
        });

        it('should match closed snapshot when open is false', () => {
            render = shallow(<TitleBox {...props} open={false} />);
            expect(render).toMatchSnapshot();
        });

        it('should call iconOnClick function when button is clicked', () => {
            render.find('button').simulate('click');

            expect(props.iconOnClick).toHaveBeenCalled();
        });
    });
});