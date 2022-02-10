import React from 'react';
import {shallow} from 'enzyme';
import Collapsible from "../Collapsible";

describe('Collapsible tests', () => {
    let props = {
        title: 'collapsibleTitle',
        id: 'collapsibleId',
        style: 'style',
        children: 'children',
        removeBanner: jest.fn()
    };

    let render;
    let instance;

    beforeEach(() => {
        render = shallow(<Collapsible {...props} />);
        instance = render.instance();
    })

    describe('Collapsible render tests', () => {
        it('should match snapshot when set to open', () => {
            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when set to closed', () => {
            render = shallow(<Collapsible {...props} open={false} />);
            expect(render).toMatchSnapshot();
        });
    });

    describe('Collapsible instance tests', () => {
        it('should set open state to false when true before and changeOpenState called', () => {
            expect(instance.state.open).toEqual(true);
            instance.changeOpenState();
            expect(instance.state.open).toEqual(false);
        });
    });
});