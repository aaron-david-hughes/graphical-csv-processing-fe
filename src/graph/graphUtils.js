function openFileTooltip(graph) {
    return commonTooltip(graph) +
        displayElement(graph, 'name');
}

function joinTooltip(graph) {
    return commonTooltip(graph) +
        displayElement(graph,'onLeft') +
        displayElement(graph,'onRight') +
        displayElement(graph, 'joinType');
}

function filterTooltip(graph) {
    return commonTooltip(graph) +
        displayElement(graph,'condition');
}

function commonTooltip(graph) {
    return "<span style='font-weight:bold'>" + graph.id + "</span><br>";
}

function displayElement(graph, id) {
    return "<br>" + id + ": " + graph.getData(id);
}

const GraphUtils = {
    openFileTooltip,
    joinTooltip,
    filterTooltip
}

export default GraphUtils;