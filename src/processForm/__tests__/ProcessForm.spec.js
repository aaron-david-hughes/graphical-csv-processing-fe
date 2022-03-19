import React from 'react';
import {shallow, mount} from 'enzyme';
import ProcessForm from "../ProcessForm";

describe('ProcessForm tests', () => {
    let props = {
        loading: jest.fn(),
        onSubmitForm: jest.fn(),
        isLoading: false,
        isGraphValid: () => true
    };

    let render;
    let instance;

    beforeEach(() => {
        render = shallow(<ProcessForm {...props} />);
        instance = render.instance();
    });

    describe('render tests', () => {
        it('should match snapshot when not processing', () => {
            expect(render).toMatchSnapshot();
        })

        it('should match snapshot when processing', () => {
            let localProps = {
                ...props,
                isLoading: true
            };

            render = shallow(<ProcessForm {...localProps} />);

            expect(render).toMatchSnapshot();
        });

        it('should call setTitle onChange of title input', () => {
            render = mount(<ProcessForm {...props} />);
            instance = render.instance();

            let setTitleSpy = jest.spyOn(instance, 'setTitle');

            render.find('#filename').simulate('change');

            expect(setTitleSpy).toHaveBeenCalled();
        });

        it('should call onSubmitForm on form submission', async () => {
            render = mount(<ProcessForm {...props} />);
            instance = render.instance();

            await render.find('#processForm').simulate('submit');

            expect(props.loading).toHaveBeenCalled();
            expect(props.onSubmitForm).toHaveBeenCalled();
        });
    });

    describe('instance tests', () => {
        describe('setTitle tests', () => {
            it('should set default title if title empty', () => {
                instance.setTitle('');
                expect(instance.state.title).toEqual('Result.zip');
            });

            it('should set suffix .zip onto end of title if not present', () => {
                instance.setTitle('test-result');
                expect(instance.state.title).toEqual('test-result.zip');
            });

            it('should set not suffix .zip onto end of title if already present', () => {
                instance.setTitle('test-result.zip');
                expect(instance.state.title).toEqual('test-result.zip');
            });
        });
    });
});