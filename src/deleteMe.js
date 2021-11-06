let data = {
    nodes: [
        {
            id: 'hello',
            group: 'files',
            operation: 'open_file',
            name: 'Attendance.csv' //--> should be able to derive this from file given
        },
        {
            id: 'second file',
            group: 'files',
            operation: 'open_file',
            name: 'DiffScores.csv'
        },
        {
            id: 'world',
            group: 'processing',
            operation: 'join',
            onLeft: 'Attendant',
            onRight: 'StudentNum'
        }
    ],
    edges: [
        {
            from: 'hello',
            to: 'world'
        },
        {
            from: 'second file',
            to: 'world'
        }
    ]
};

setActiveGraphCookie();

let chart;

anychart.onDocumentReady(() => {
    createGraph();
    window.addEventListener('DOMContentLoaded', () => updateFormInputs());
});

function createGraph() {
    chart = anychart.graph(data);
    setUp(chart);
}

function setUp() {

    // set the title
    chart.title('title holder');

    // access nodes
    let graphNodes = chart.nodes();

    // enable the labels of nodes
    setNodeLabels(graphNodes)

    // node appearance
    setNodeAppearance(graphNodes)
    setFileNodeAppearance(chart);
    setProcessingNodeAppearance(chart);

    //info card when hovered over
    setTooltip(chart);

    //edges have arrows
    setArrows(chart);

    // add a zoom control panel
    setZoom(chart);

    addNodeClickListener(chart);
    // addInlineErrorBlurListener(chart);

    // draw the chart
    chart.container('graphCanvas').draw();
}





function addNode(node) {
    //impact data object and update cookie
    data.nodes.push(node);

    // re-render graph
    chart.dispose();
    createGraph();

    //update divs in processForm to reflect state of nodes in graph
    updateFormInputs();

    setActiveGraphCookie();
}







function setActiveGraphCookie() {
    Cookies.set('activeGraphData', JSON.stringify(data), {expires: 365});
}

function setTooltip(chart) {
    chart.tooltip().useHtml(true);
    chart.tooltip().format(function() {

        if (this.type === 'node') {
            let contents = "<span style='font-weight:bold'>" + this.id + "</span><br>";

            contents += displayElement(this, 'operation');

            switch(this.getData('operation')) {
                case 'open_file':
                case 'new_file':
                    contents += displayElement(this, 'name');
                    break;
                case 'join':
                    contents += displayElement(this,'onLeft')
                        + displayElement(this,'onRight');
                    break;
                case 'filter':
                    contents += displayElement(this,'condition');
                    break;
            }

            return contents;
        } else {
            return this.getData("from") + " -> " + this.getData("to");
        }
    });
}

function displayElement(obj, id) {
    return "<br>" + id + ": " + obj.getData(id);
}

function setArrows(chart) {
    let arrows = chart.edges().arrows();
    arrows.enabled(true);
    arrows.size(15);
}

function setZoom(chart) {
    let zoomController = anychart.ui.zoom();
    zoomController.target(chart);
    zoomController.render();
}

function addNodeClickListener(chart) {
    chart.listen("click", function(e) {
        let tag = e.domTarget.tag;
        if (tag) {
            console.log(`Clicked ${tag.type} with ID ${tag.id}`);

            if (tag.type === 'node') {
                let divs = document.getElementById("processorForm").getElementsByTagName("div");

                console.log(divs);

                for (let i = 0; i < divs.length; i++) {
                    divs[i].style.display = 'none';
                }

                document.getElementById(`${tag.id}-form`).setAttribute("style", "visibility: block");
            }
        }
    });
}

function addInlineErrorBlurListener(chart) {
    chart.listen("mouseOver", function(e) {
        chart.nodes().normal().stroke("#FF0000", 3);
        chart.nodes().labels().fontColor("#ff0000");
        chart.nodes().labels().format("Error: {%id}");
    });
}

function updateFormInputs() {
    data.nodes.forEach(node => {
        if (!document.getElementById(`${node.id}-form`)) {
            switch (node.operation) {
                case "join":
                    joinFormDiv(node);
                    break;
                case "open_file":
                    openFileFormDiv(node);
                    break;
            }
        }
    });

    if (document.getElementById('processorFormSubmit')) {
        let submit = document.getElementById('processorFormSubmit');
        submit.parentElement.removeChild(submit);
    }

    document.getElementById('processorForm').insertAdjacentHTML(
        'beforeend',
        '<input id="processorFormSubmit" type="submit" value="Process Graph">'
    );
}

function joinFormDiv(node) {
    document.getElementById('processorForm').insertAdjacentHTML(
        'beforeend',
        '<div id="' + node.id + '-form" style="display: none">' +
        '<p><strong>' + node.id + '</strong></p>' +
        '</div>'
    );
}

function openFileFormDiv(node) {
    document.getElementById('processorForm').insertAdjacentHTML(
        'beforeend',
        '<div id="' + node.id + '-form" style="display: none">' +
        '<p><strong>' + node.id + '</strong></p>' +
        '<label>Choose File: </label>' +
        '<input type="file" name="csvFiles" accept="text/csv" required>' +
        '</div>'
    );
}

function dropdown(elementId) {
    //display or hide content in dropdown
    let style = document.getElementById(`${elementId}Content`).style;
    let display = style.display;

    if (display === 'block') style.display = 'none';
    else style.display = 'block';

    //change arrow direction
    let classList = document.getElementById(`${elementId}Arrow`).classList;

    if (classList.contains('down')) classList.replace('down', 'up');
    else classList.replace('up', 'down');
}