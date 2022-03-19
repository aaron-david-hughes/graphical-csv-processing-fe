import GraphUtils from "../graphUtils";
import Config from "../../config.json";
import deepClone from "lodash.clonedeep";

describe('graphUtils tests', () => {
    let testGetData = function(data, key) {
        return data[key];
    }

    describe('fileToolTip tests', () => {
        let fileNodeData;

        it('should render html with no errors when valid data', () => {
            fileNodeData = {
                operation: 'open_file',
                name: 'name.csv',
                expectedInputs: '0',
                inputCardinality: '0'
            };

            expect(GraphUtils.fileTooltip(setUpGraph(fileNodeData))).toMatchSnapshot();
        });

        it('should render html with cardinality error when valid data with incorrect input edges', () => {
            fileNodeData = {
                operation: 'open_file',
                name: 'name.csv',
                expectedInputs: '0',
                inputCardinality: '1'
            };

            expect(GraphUtils.fileTooltip(setUpGraph(fileNodeData))).toMatchSnapshot();
        });

        it('should render html with data validity error when invalid data with correct input edges', () => {
            fileNodeData = {
                operation: 'open_file',
                name: null,
                expectedInputs: '0',
                inputCardinality: '0'
            };

            expect(GraphUtils.fileTooltip(setUpGraph(fileNodeData))).toMatchSnapshot();
        });

        it('should render html with both validity and cardinality errors when invalid data with incorrect input edges', () => {
            fileNodeData = {
                operation: 'open_file',
                name: null,
                expectedInputs: '0',
                inputCardinality: '1'
            };

            expect(GraphUtils.fileTooltip(setUpGraph(fileNodeData))).toMatchSnapshot();
        });
    });

    describe('processToolTip tests', () => {
        let processingNodeData;

        it('should render html with no errors when valid data', () => {
            processingNodeData = {
                operation: 'join',
                specificOperation: 'join_left',
                onLeft: 'test1',
                onRight: 'test2',
                joinType: 'left',
                expectedInputs: '2',
                inputCardinality: '2'
            };

            expect(GraphUtils.processTooltip(setUpGraph(processingNodeData), Config)).toMatchSnapshot();
        });

        it('should render html with cardinality error when valid data with incorrect input edges', () => {
            processingNodeData = {
                operation: 'join',
                specificOperation: 'join_left',
                onLeft: 'test1',
                onRight: 'test2',
                joinType: 'left',
                expectedInputs: '2',
                inputCardinality: '1'
            };

            expect(GraphUtils.processTooltip(setUpGraph(processingNodeData), Config)).toMatchSnapshot();
        });

        it('should render html with data validity error when invalid data with correct input edges', () => {
            processingNodeData = {
                operation: 'join',
                specificOperation: 'join_left',
                onLeft: 'test1',
                onRight: null,
                joinType: 'left',
                expectedInputs: '2',
                inputCardinality: '2'
            };

            expect(GraphUtils.processTooltip(setUpGraph(processingNodeData), Config)).toMatchSnapshot();
        });

        it('should render html with no errors when data missing but not configured to be required', () => {
            processingNodeData = {
                operation: 'join',
                specificOperation: 'join_left',
                onLeft: 'test1',
                onRight: null,
                joinType: 'left',
                expectedInputs: '2',
                inputCardinality: '2'
            };

            let nodeConfig = deepClone(Config);
            nodeConfig.processing.operations.find(op => op.operation === 'join_left').onRight.required = false;

            expect(GraphUtils.processTooltip(setUpGraph(processingNodeData), nodeConfig)).toMatchSnapshot();
        });

        it('should render html with both validity and cardinality errors when invalid data with incorrect input edges', () => {
            processingNodeData = {
                operation: 'join',
                specificOperation: 'join_left',
                onLeft: 'test1',
                onRight: null,
                joinType: 'left',
                expectedInputs: '2',
                inputCardinality: '3'
            };

            expect(GraphUtils.processTooltip(setUpGraph(processingNodeData), Config)).toMatchSnapshot();
        });
    });

    function setUpGraph(data) {
        return {
            id: 'testId',
            getData: testGetData.bind(null, data)
        };
    }
});