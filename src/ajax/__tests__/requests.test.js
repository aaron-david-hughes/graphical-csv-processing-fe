import * as requests from '../requests';
import Axios from "axios";

describe('requests test', () => {

    describe('graphicalCsvProcessingAPI tests', () => {
        it('should not call backend when formContent is null', () => {
            let addBanner = jest.fn();
            let axiosSpy = jest.spyOn(Axios, 'post');

            requests.graphicalCsvProcessingAPI(null, 'filename', addBanner, 'backend');

            expect(axiosSpy).toBeCalledTimes(0);
        });

        it('should not call backend when formContent.files is null', () => {
            let addBanner = jest.fn();
            let axiosSpy = jest.spyOn(Axios, 'post');

            requests.graphicalCsvProcessingAPI({files: null}, 'filename', addBanner, 'backend');

            expect(axiosSpy).toBeCalledTimes(0);
        });

        it('should not call backend when formContent.files is empty', () => {
            let addBanner = jest.fn();
            let axiosSpy = jest.spyOn(Axios, 'post');

            requests.graphicalCsvProcessingAPI({files: []}, 'filename', addBanner, 'backend');

            expect(axiosSpy).toBeCalledTimes(0);
        });

        it('should not call backend when formContent.graphData is null', () => {
            let addBanner = jest.fn();
            let axiosSpy = jest.spyOn(Axios, 'post');

            requests.graphicalCsvProcessingAPI({files: [{file: ''}]}, 'filename', addBanner, 'backend');

            expect(axiosSpy).toBeCalledTimes(0);
        });

        it('should not call backend when formContent.graphData.nodes is null', () => {
            let addBanner = jest.fn();
            let axiosSpy = jest.spyOn(Axios, 'post');

            let formContent = {files: [{file: ''}], graphData: {}}

            requests.graphicalCsvProcessingAPI(formContent, 'filename', addBanner, 'backend');

            expect(axiosSpy).toBeCalledTimes(0);
        });

        it('should not call backend when formContent.graphData.nodes is empty', () => {
            let addBanner = jest.fn();
            let axiosSpy = jest.spyOn(Axios, 'post');

            let formContent = {files: [{file: ''}], graphData: {nodes: []}}

            requests.graphicalCsvProcessingAPI(formContent, 'filename', addBanner, 'backend');

            expect(axiosSpy).toBeCalledTimes(0);
        });

        it('should call saveFile when backend responds without error', async () => {
            jest.mock('axios');
            Axios.post = jest.fn().mockImplementation(() => Promise.resolve({data: 'data'}));

            let addBanner = jest.fn();
            global.URL.createObjectURL = jest.fn();

            let formContent = {files: [{file: ''}], graphData: {nodes: [{}]}}

            await requests.graphicalCsvProcessingAPI(formContent, 'filename', addBanner, 'backend');

            expect(global.URL.createObjectURL).toBeCalledTimes(1);
            expect(global.URL.createObjectURL).toBeCalledWith('data');
        });

        it('should call banner with response message when backend responds with error', async () => {
            jest.mock('axios');
            Axios.post = jest.fn().mockImplementation( () => Promise.reject({
                response: {
                    data: {text: () => 'error message'},
                    status: 'statusCode'
                }
            }));

            let addBanner = jest.fn();
            let formContent = {files: [{file: ''}], graphData: {nodes: [{}]}}

            await requests.graphicalCsvProcessingAPI(formContent, 'filename', addBanner, 'backend');

            setTimeout(() => {
                expect(addBanner).toBeCalledTimes(1);
                expect(addBanner).toBeCalledWith({
                    msg: `Response code statusCode: error message`,
                    type: 'failure'
                });
            }, 1000);

        });

        it('should call banner with general message when backend called but no response', async () => {
            jest.mock('axios');
            Axios.post = jest.fn().mockImplementation( () => Promise.reject({
                response: null
            }));

            let addBanner = jest.fn();
            let formContent = {files: [{file: ''}], graphData: {nodes: [{}]}}

            await requests.graphicalCsvProcessingAPI(formContent, 'filename', addBanner, 'backend');

            setTimeout(() => {
                expect(addBanner).toBeCalledTimes(1);
                expect(addBanner).toBeCalledWith({
                    msg: `An internal error has occurred`,
                    type: 'failure'
                });
            }, 1000);

        });
    })

    describe('saveFile tests', () => {
      it('should call URL createObjectURL', () => {
          global.URL.createObjectURL = jest.fn();

          requests.saveFile('data', 'filename');

          expect(global.URL.createObjectURL).toBeCalledTimes(1);
          expect(global.URL.createObjectURL).toBeCalledWith('data');
      });
    });
});