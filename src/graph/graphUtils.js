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
    let operation = graph.getData('operation');

    let template = config.processing.operations
        .find(op => op.operation === operation).template;
    let str = commonTooltip(graph);

    for (let attr of Object.keys(template)) {
        str += displayElement(graph, attr);
    }

    str += validConfig ? "" : invalidConfig();

    str += invalidInputCardinality(graph);

    return str;
}

function commonTooltip(graph) {
    return "<span style='font-weight:bold'>" + graph.id + "</span><br>";
}

function displayElement(graph, id) {
    let value = graph.getData(id);

    if (value === null) validConfig = false;

    return "<br>" + id + ": " + value;
}

function invalidInputCardinality(graph) {
    let inputCardinality = graph.getData('inputCardinality');
    let expectedInputs = graph.getData('expectedInputs');

    if (inputCardinality !== expectedInputs) {
        return "<br><p style='color: #FF272A'>Invalid number of inputs: " + inputCardinality + ", must be: " + expectedInputs + ".</p>";
    }

    return "";
}

function invalidConfig() {
    return "<br><p style='color: #FF272A'>Invalid config, edit this node to have valid configuration.</p>"
}

const GraphUtils = {
    fileTooltip,
    processTooltip
}


export default GraphUtils;