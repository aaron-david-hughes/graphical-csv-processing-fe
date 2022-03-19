import FileNodes, {isValidFromStart, AllNodeTypes, getNodeObjTemplate, nodeDependentState} from "../FileNodes";
import Config from "../../../config.json";
import deepClone from "lodash.clonedeep";

describe('FileNodes tests', () => {
    let processingConfig = {
        processing: {
            operations: [
                ...Config.processing.operations.filter(op => op.operation === 'join_left' || op.operation === 'drop_alias')
            ]
        }
    };

    describe('isValidFromStart tests', () => {
        it('should return false for open_file operations', () => {
            expect(isValidFromStart(Config, 'open_file')).toEqual(false);
        });

        it('should return false for write_file operations', () => {
            expect(isValidFromStart(Config, 'write_file')).toEqual(false);
        });

        it('should return false for processing operation with configuration required', () => {
            expect(isValidFromStart(Config, 'join_left')).toEqual(false);
        });

        it('should return true for processing operation with configuration not required', () => {
            expect(isValidFromStart(Config, 'drop_alias')).toEqual(true);
        });
    });

    describe('AllNodeTypes tests', () => {
        it('should return formatted object containing simpled display info on node types', () => {
            let output = AllNodeTypes(processingConfig);

            expect(output.length).toEqual(4);
            expect(output[0]).toEqual({"name": "Open File", "operation": "open_file"});
            expect(output[1]).toEqual({"name": "Write File", "operation": "write_file"});
            expect(output[2]).toEqual({"name": "Join Left", "operation": "join_left"});
            expect(output[3]).toEqual({"name": "Drop Alias", "operation": "drop_alias"});
        });
    });

    describe('getNodeObjTemplate tests', () => {
        it('should return open file object when operation is open_file', () => {
            expect(getNodeObjTemplate(processingConfig, 'open_file')).toEqual(FileNodes["Open File"]);
        });

        it('should return write file object when operation is write_file', () => {
            expect(getNodeObjTemplate(processingConfig, 'write_file')).toEqual(FileNodes["Write File"]);
        });

        it('should return processing object created as per config', () => {
            let output = getNodeObjTemplate(processingConfig, 'join_left');

            expect(output).toEqual({
                ...processingConfig.processing.operations[0].template,
                group: 'processing'
            });
        })
    });

    describe('nodeDependentState tests', () => {
        let config = {
            processing: {
                operations: [
                    {
                        operation: 'test_op',
                        template: {
                            operation: 'test_op',
                            field1: null,
                            field2: null,
                            field3: true
                        },
                        field1: {
                            input: 'numeric',
                            required: false
                        },
                        field2: {
                            input: 'integer',
                            required: true
                        },
                        field3: {
                            input: 'switch',
                            required: true
                        }
                    }
                ]
            }
        };

        describe('editing - there is startNode', () => {
            let startNode = {
                operation: 'open_file',
                name: 'test',
                expectedInputs: 1
            };

            it('should carry out editNodeDependentState when operation matches startNode operation', () => {
                let output = nodeDependentState(startNode, true, Config, 'open_file');

                expect(output.nodeObj).toEqual(startNode);
                expect(output.inputValidity).toEqual({
                    name: 'valid'
                });
            });

            it('should carry out regular nodeDependentState when operation does not matches startNode operation or specificOperation', () => {
                let output = nodeDependentState(startNode, false, Config, 'join_left');

                expect(output.nodeObj).toEqual({
                    ...Config.processing.operations.find(op => op.operation === 'join_left').template,
                    ...Config.processing.generalTemplate
                });
                expect(output.inputValidity).toEqual({
                    onLeft: 'notStarted',
                    onRight: 'notStarted'
                });
            });

            //non required field filled in => use numeric field config
            it('should validate filled in non required fields', () => {
                let localStartNode = {
                    operation: 'test_op',
                    field1: 'not a number',
                    field2: '3',
                    field3: true
                };

                let output = nodeDependentState(localStartNode, false, config, 'test_op');

                expect(output.nodeObj).toEqual(localStartNode);
                expect(output.inputValidity).toEqual({
                    field1: 'invalid',
                    field2: 'valid',
                    field3: 'valid'
                });
            });

            it('should not validate an empty non required fields', () => {
                let localStartNode = {
                    operation: 'test_op',
                    field1: null,
                    field2: '3',
                    field3: false
                };

                let output = nodeDependentState(localStartNode, false, config, 'test_op');

                expect(output.nodeObj).toEqual(localStartNode);
                expect(output.inputValidity).toEqual({
                    field1: 'valid',
                    field2: 'valid',
                    field3: 'valid'
                });
            });

            it('should carry out editNodeDependentState when operation matches startNode specific operation', () => {
                let localStartNode = {
                    operation: "join",
                    specificOperation: "join_left",
                    onLeft: 'correct',
                    onRight: null,
                    joinType: "left",
                    expectedInputs: 2
                };

                let output = nodeDependentState(localStartNode, true, Config, 'join_left');

                expect(output.nodeObj).toEqual(localStartNode);
                expect(output.inputValidity).toEqual({
                    onLeft: 'valid',
                    onRight: 'invalid'
                });
            });

            it('should not validate non required empty field when operation is not startNode', () => {
                let localStartNode = {
                    operation: 'write_file',
                    name: 'test'
                };

                let output = nodeDependentState(localStartNode, false, config, 'test_op');

                expect(output.nodeObj).toEqual({
                    ...config.processing.operations[0].template,
                    group: 'processing'
                });
                expect(output.inputValidity).toEqual({
                    field1: 'valid',
                    field2: 'notStarted',
                    field3: 'valid'
                });
            });
        });

        describe('adding - there is no startNode', () => {
            it('should generate a template with recognition of invalid fields not flagged', () => {
                let output = nodeDependentState(null, false, Config, 'write_file');

                expect(output.nodeObj).toEqual(FileNodes["Write File"]);
                expect(output.inputValidity).toEqual({
                    name: 'notStarted'
                });
            });

            it('should generate a template with recognition of invalid fields flagged', () => {
                let output = nodeDependentState(null, true, Config, 'join_left');

                expect(output.nodeObj).toEqual({
                    ...Config.processing.operations.find(op => op.operation === 'join_left').template,
                    ...Config.processing.generalTemplate
                });
                expect(output.inputValidity).toEqual({
                    onLeft: 'invalid',
                    onRight: 'invalid'
                });
            });
        });
    });
});