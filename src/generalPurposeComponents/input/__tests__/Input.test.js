import React from 'react';
import {shallow} from 'enzyme';
import Input from '../Input';

let componentProps = {
    input: {
        props: {
            id: 'htmlInputOption'
        }
    },
    isInvalid: true,
    style: {
        color: 'black',
        borderColor: 'unset'
    },
    title: 'inputTest',
    required: true,
    errorText: 'there is an error'
};

describe('input component tests', () => {

    describe('render tests when input invalid', () => {
        let render;

        beforeEach(() => {
            render = shallow(<Input {...componentProps} />);
        });

        it('should render to match error snapshot', () => {
            expect(render).toMatchSnapshot();
        });

        describe('render tests when input invalid', () => {
            it('css set for error', () => {
                let style = render.find('#htmlInputOption-inputDiv').props()["style"];

                expect(style.color).toEqual('red');
                expect(style.borderColor).toEqual('red !important');
            });

            it('should render a p component for error text display', () => {
                let text = render.find('p').text();

                expect(text).toEqual(' ' + componentProps.errorText);
            })
        });
    });

    describe('render tests when input valid', () => {
        let render;

        let validComponentProps = {
            ...componentProps,
            isInvalid: false
        }

        beforeEach(() => {
            render = shallow(<Input {...validComponentProps} />);
        });

        it('should render to match non error snapshot', () => {
            expect(render).toMatchSnapshot();
        });

        describe('render tests when input valid', () => {
            it('css set for error', () => {
                let style = render.find('#htmlInputOption-inputDiv').props()["style"];

                expect(style.color).toEqual('black');
                expect(style.borderColor).toEqual('unset');
            });

            it('should not render a p component when valid', () => {
                let text = render.find('p');

                expect(text).toEqual({});
            })
        });
    });

    describe('required input tests', () => {
        let render;

        beforeEach(() => {
            render = shallow(<Input {...componentProps} />);
        });

        it('title has required star', () => {
            let title = render.find('label').text();

            expect(title).toEqual('inputTest*');
        });
    })

    describe('not required input tests', () => {
        let render;

        let notRequiredProps = {
            ...componentProps,
            required: false
        }

        beforeEach(() => {
            render = shallow(<Input {...notRequiredProps} />);
        });

        it('title does not have required star', () => {
            let title = render.find('label').text();

            expect(title).toEqual('inputTest');
        });
    })
});