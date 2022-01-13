const fileNodeConfig = {
    normal:   {
        shape: "square",
        fill: "#686868"
    },
    hovered:  {
        shape: "square",
        fill: "#686868"
    },
    selected: {
        shape: "square",
        fill: "#686868"
    }
};

const FileNodes = {
    'Open File': {
        ...fileNodeConfig,
        group: 'file',
        operation: 'open_file',
        name: null
    },
    'Write File': {
        ...fileNodeConfig,
        group: 'file',
        operation: 'write_file',
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
                nodeObj: FileNodes["Open File"],
                inputValidity: {
                    name: validity
                }
            };
        case 'write_file':
            return {
                nodeObj: FileNodes["Write File"],
                inputValidity: {
                    name: validity
                }
            };
        default:
            let template = config.processing.operations
                .find(op => op.operation === operation).template;
            return {
                nodeObj: {
                    ...config.processing.generalTemplate,
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