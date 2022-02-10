let validConfig;

function fileTooltip(graph) {
    validConfig = true;

    let str = commonTooltip(graph) +
        displayElement(graph, 'operation') +
        displayElement(graph, 'name') +
        displayElement(graph, 'expectedInputs') +
        invalidInputCardinality(graph);

    str += validConfig ? "" : invalidConfig();

    return str;
}

function processTooltip(graph, config) {
    validConfig = true;
    let operation = graph.getData('specificOperation');

    if (!operation) operation = graph.getData('operation');

    let operationConfig = config.processing.operations
        .find(op => op.operation === operation);
    let str = commonTooltip(graph);

    for (let attr of Object.keys(operationConfig.template)) {
        str += displayElement(graph, attr, operationConfig[attr]);
    }

    str += validConfig ? "" : invalidConfig();

    str += invalidInputCardinality(graph);

    return str;
}

function commonTooltip(graph) {
    return "<span style='font-weight:bold'>" + graph.id + "</span><br>";
}

function displayElement(graph, id, idConfig) {
    let value = graph.getData(id);

    //if null and required field
    if (value === null && idConfig && idConfig.required) validConfig = false;

    return "<br>" + id + ": " + value;
}

function invalidInputCardinality(graph) {
    let inputCardinality = graph.getData('inputCardinality');
    let expectedInputs = graph.getData('expectedInputs');

    if (inputCardinality !== expectedInputs) {
        return "<br><p style='background-color: #FF272A !important; margin: 2px; padding: 5px; border-radius: 8px;'>" +
            "Invalid number of inputs: " + inputCardinality + ", must be: " + expectedInputs + ".</p>";
    }

    return "";
}

function invalidConfig() {
    return "<br><p style='background-color: #FF272A !important; margin: 2px; padding: 5px; border-radius: 8px;'>" +
        "Invalid config, double click to edit the configuration.</p>"
}

const GraphUtils = {
    fileTooltip,
    processTooltip
}


export default GraphUtils;