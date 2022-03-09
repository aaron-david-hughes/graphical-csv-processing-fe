import React from 'react';
import {shallow} from 'enzyme';
import Switch from '../Switch';

describe('Switch component tests', () => {
    let render;

    beforeEach(() => {
        render = shallow(<Switch title='switchTestTitle' isChecked={true} onChange={jest.fn()}/>)
    });

    describe('render tests', () => {
        it('should match snapshot', () => {
            expect(render).toMatchSnapshot();
        });

        it('should have title matching props', () => {
            let title = render.find('label').text();

            expect(title).toContain('switchTestTitle');
        });
    });
});