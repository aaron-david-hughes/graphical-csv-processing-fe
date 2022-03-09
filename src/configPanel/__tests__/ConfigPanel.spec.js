import React from 'react';
import {shallow} from 'enzyme';
import ConfigPanel from "../ConfigPanel";

describe('ConfigPanel tests', () => {
    let props = {
        config: jest.fn(),
        addNode: jest.fn(),
        addFile: jest.fn(),
        graphData: jest.fn(),
        addBanner: jest.fn(),
        onSubmitForm: jest.fn(),
        isGraphValid: true,
        loading: jest.fn(),
        isLoading: true
    };

    let render;

    beforeEach(() => {
        render = shallow(<ConfigPanel {...props} />);
    });

    afterEach(() => {
        render.unmount();
    });

    describe('ConfigPanel render tests', () => {
        it('shouldMatchSnapshot', () => {
            expect(render).toMatchSnapshot();
        });
    });
});