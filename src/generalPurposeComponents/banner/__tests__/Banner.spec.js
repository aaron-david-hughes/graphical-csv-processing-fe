import React from 'react';
import {shallow} from 'enzyme';
import Banner from '../Banner';

describe('Banner tests', () => {
    let props = {
        type: 'failure',
        id: 'testId',
        msg: 'test message',
        timeToLive: 1000,
        removeBanner: jest.fn()
    };

    let render;
    let instance;

    beforeEach(() => {
       render = shallow(<Banner {...props} />);
       instance = render.instance();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Banner render tests', () => {
        it('should match snapshot when failure', () => {
            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when success', () => {
            render = shallow(<Banner {...props} type='success' />);
            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when warning', () => {
            render = shallow(<Banner {...props} type='warning' />);
            expect(render).toMatchSnapshot();
        });

        it('should match snapshot when neutral', () => {
            render = shallow(<Banner {...props} type='neutral' />);
            expect(render).toMatchSnapshot();
        });
    });

    describe('Banner instance tests', () => {
        it('should call the setTimeout function', () => {
            jest.useFakeTimers();
            jest.spyOn(global, 'setTimeout');

            instance.componentDidMount();

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
        });

        it('should call removeBanner after 1 second', () => {
            jest.useFakeTimers();

            instance.componentDidMount();

            jest.runAllTimers();

            expect(props.removeBanner).toHaveBeenCalled();
            expect(props.removeBanner).toHaveBeenCalledWith('testId');
        });
    });
});