import deepClone from 'lodash.clonedeep';
import Validation from '../validation/Validation'

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

export function isValidFromStart(config, operation) {
    if (operation === 'open_file' || operation === 'write_file') return false;

    let template = config.processing.operations
        .find(op => op.operation === operation).template;

    return Object.keys(template)
        .filter(key => key !== 'operation' && key !== 'specificOperation' && key !== 'expectedInputs').length === 0;
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

export function getNodeObjTemplate(config, operation) {
    switch(operation) {
        case 'open_file':
            return deepClone(FileNodes["Open File"]);
        case 'write_file':
            return deepClone(FileNodes["Write File"]);
        default:
            let template = config.processing.operations
                .find(op => op.operation === operation).template;
            return {
                ...deepClone(config.processing.generalTemplate),
                group: 'processing',
                ...template
            };
    }
}

function validateField(value, type) {
    let e = {
        target: {
            value: value
        }
    }

    let valid;

    switch (type) {
        case 'text':
            valid = Validation.validateTextField(e);
            break;
        case 'numeric':
            valid = Validation.validateNumericField(e);
            break;
        case 'integer':
            valid = Validation.validateIntegerField(e);
            break
        default:
            valid = true;
    }

    return valid ? 'valid' : 'invalid';
}

function editNodeDependentState(startNode, config) {
    console.log('inside edit node dependent state')
    let inputValidity;

    let operation = startNode.specificOperation ? startNode.specificOperation : startNode.operation;

    switch (operation) {
        case 'open_file':
        case 'write_file':
            inputValidity = {
                name: validateField(startNode.name, 'text')
            }
            break;
        default:
            let operationConfig = config.processing.operations
                .find(op => op.operation === operation);

            inputValidity = {};

            for (let entry of Object.entries(operationConfig.template)) {
                let key = entry[0];

                if (key !== 'operation' && operationConfig[key]) {
                    if (operationConfig[key].required) {
                        inputValidity[key] = validateField(startNode[key], operationConfig[key].input);
                    } else {
                        inputValidity[key] = 'valid';
                    }
                }
            }
    }

    return {
        nodeObj: deepClone(startNode),
        inputValidity
    }
}

export function nodeDependentState(startNode, showNotStartedErrors, config, operation) {
    if (startNode && (startNode.specificOperation === operation || startNode.operation === operation)) {
        return editNodeDependentState(startNode, config);
    }

    let validity = startNode ? 'valid' : 'invalid';

    if (!showNotStartedErrors) validity = 'notStarted';

    switch (operation) {
        case 'open_file':
        case 'write_file':
            return {
                nodeObj: getNodeObjTemplate(config, operation),
                inputValidity: {
                    name: validity
                }
            };
        default:
            let operationConfig = config.processing.operations
                .find(op => op.operation === operation);
            return {
                nodeObj: getNodeObjTemplate(config, operation),
                inputValidity: {
                    ...processingInputValidityStartState(operationConfig, validity)
                }
            };
    }
}

export function processingInputValidityStartState(operationConfig, validity) {
    let inputValidity = {};

    for (let [key, value] of Object.entries(operationConfig.template)) {
        if (value === null) {
            inputValidity[key] = validity
        }

        if (key !== 'operation' && operationConfig[key] && !operationConfig[key].required) {
            inputValidity[key] = 'valid';
        }
    }

    return inputValidity;
}

export default FileNodes;