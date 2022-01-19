import deepClone from 'lodash.clonedeep';

const fileNodeConfig = {
    normal:   {
        shape: "square",
        fill: "purple"
    },
    hovered:  {
        shape: "square",
        fill: "purple"
    },
    selected: {
        shape: "square",
        fill: "purple"
    }
};

const FileNodes = {
    'Open File': {
        ...fileNodeConfig,
        group: 'file',
        operation: 'open_file',
        expectedInputs: 0,
        name: null
    },
    'Write File': {
        ...fileNodeConfig,
        group: 'file',
        operation: 'write_file',
        expectedInputs: 1,
        name: null
    }
}

export function AllNodeTypes(processingNodeConfig) {
    return [
        ...Object.keys(FileNodes).map(fileOpName => {
            return {name: fileOpName, operation: FileNodes[fileOpName].operation}
        }),
        ...processingNodeConfig.processing.operations.map(node => {
            return {name: node.name, operation: node.operation}
        })
    ];
}

export function nodeDependentState(valid, showNotStartedErrors, config, operation) {
    let validity = valid ? 'valid' : 'invalid';

    if (!showNotStartedErrors) validity = 'notStarted';

    switch (operation) {
        case 'open_file':
            return {
                nodeObj: deepClone(FileNodes["Open File"]),    //need to deep clone
                inputValidity: {
                    name: validity
                }
            };
        case 'write_file':
            return {
                nodeObj: deepClone(FileNodes["Write File"]),   //need to deep clone
                inputValidity: {
                    name: validity
                }
            };
        default:
            let template = config.processing.operations
                .find(op => op.operation === operation).template;
            return {
                nodeObj: {
                    ...deepClone(config.processing.generalTemplate),   //need to deep clone
                    group: 'processing',
                    ...template
                },
                inputValidity: {
                    ...processingInputValidityStartState(template, validity)
                }
            };
    }
}
function processingInputValidityStartState(template, validity) {
    let inputValidity = {};

    for (let [key, value] of Object.entries(template)) {
        if (value === null) {
            inputValidity[key] = validity
        }
    }

    return inputValidity;
}

export default FileNodes;