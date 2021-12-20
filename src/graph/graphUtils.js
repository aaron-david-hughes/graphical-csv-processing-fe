function fileTooltip(graph) {
    return commonTooltip(graph) +
        displayElement(graph, 'operation') +
        displayElement(graph, 'name');
}

function processTooltip(graph, config) {
    let operation = graph.getData('operation');

    let template = config.processing.operations
        .find(op => op.operation === operation).template;
    let str = commonTooltip(graph);

    for (let attr of Object.keys(template)) {
        str += displayElement(graph, attr);
    }

    return str;
}

function commonTooltip(graph) {
    return "<span style='font-weight:bold'>" + graph.id + "</span><br>";
}

function displayElement(graph, id) {
    return "<br>" + id + ": " + graph.getData(id);
}

const GraphUtils = {
    fileTooltip,
    processTooltip
}


export default GraphUtils;