import 'cypress-react-selector';
import '@4tw/cypress-drag-drop';
import 'cypress-file-upload';
import path from 'path';
import ScoreLessThan45ExpectedData from '../payloads/ScoreLessThan45ExpectedData';

describe('User Acceptance Tests', () => {
    beforeEach(() => {
        let endpoint = Cypress.env('FRONTEND') ? Cypress.env('FRONTEND') : 'http://localhost:3000';
        cy.visit(endpoint);
        cy.waitForReact(1000, '#root');
    });

    test('should allow manipulation of graph', graphId => {
        cy.get('select#nodeOptions').select('join_left');
        cy.get('button#next').click();

        //try to add incorrectly formatted node
        cy.get('button#addNode').click();
        cy.get('div#join_left-onLeft-input-inputDiv').children().get('p').contains(' Please fill in this field.');
        cy.get('div#join_left-onRight-input-inputDiv').children().get('p').contains(' Please fill in this field.');

        //try to invalidly fill form
        cy.get('input#join_left-onLeft-input').type('column1').clear();
        cy.get('input#join_left-onRight-input').type('column2').clear();
        cy.get('button#addNode').click();
        cy.get('div#join_left-onLeft-input-inputDiv').children().get('p').contains(' Please fill in this field.');
        cy.get('div#join_left-onRight-input-inputDiv').children().get('p').contains(' Please fill in this field.');

        //return to node type selection
        cy.get('button#prev').click();

        addNodeAndValidate(formGraphElementId(graphId, 'x'), 'join_left', {
            onLeft: 'column1',
            onRight: 'column2'
        });

        moveNode(formGraphElementId(graphId, 'x'), -50, -50);
        checkMove(formGraphElementId(graphId, 'x'), '-50', '-50');

        //edit
        cy.get(formGraphElementId(graphId, 'x')).dblclick();
        checkPresence('div#editNodePopup');
        verifyFormContent({
            'select#nodeOptions': 'join_left',
            'input#join_left-onLeft-input': 'column1',
            'input#join_left-onRight-input': 'column2',
        });
        cy.get('input#join_left-onLeft-input').clear();
        cy.get('input#join_left-onRight-input').clear();
        cy.get('input#join_left-onLeft-input').type('column3');
        cy.get('input#join_left-onRight-input').type('column4');
        cy.get('button#edit').click();
        cy.get('button#edit').click();

        //verify edit and cancel
        cy.get(formGraphElementId(graphId, '27')).dblclick();
        checkPresence('div#editNodePopup');
        verifyFormContent({
            'select#nodeOptions': 'join_left',
            'input#join_left-onLeft-input': 'column3',
            'input#join_left-onRight-input': 'column4',
        });
        cy.get('button#cancel').click();

        //add another node
        addNodeAndValidate(formGraphElementId(graphId, '5g'), 'alias', {
            alias: 'testAlias'
        });

        moveNode(formGraphElementId(graphId, '5g'), 75, -65);
        checkMove(formGraphElementId(graphId, '5g'), '75', '-65');

        addEdgeAndValidate(
            formGraphElementId(graphId, '8u'),
            formGraphElementId(graphId, '5f'),
            formGraphElementId(graphId, '6s')
        );

        //delete
        cy.get(formGraphElementId(graphId, '8u')).dblclick();
        cy.get(formGraphElementId(graphId, 'b0')).dblclick();
        cy.get('button#delete').click();
        cy.get(formGraphElementId(graphId, 'dn')).dblclick();
        cy.get('button#delete').click();
    });

    test('process a query from scratch - the list of people and count who scored less than 45', graphId => {
        addOpenFileNodeAndValidate(formGraphElementId(graphId, 'x'), 'classlist.csv');
        zoomOut(2);
        moveNode(formGraphElementId(graphId, 'x'), -180, 0);

        addOpenFileNodeAndValidate(formGraphElementId(graphId, '1l'), 'marks1.csv');
        zoomOut(2);
        moveNode(formGraphElementId(graphId, '1l'), -90, -100);

        addOpenFileNodeAndValidate(formGraphElementId(graphId, '2a'), 'marks2.csv');
        zoomOut(2);
        moveNode(formGraphElementId(graphId, '2a'), -60, -100);

        addOpenFileNodeAndValidate(formGraphElementId(graphId, '30'), 'marks3.csv');
        zoomOut(2);
        moveNode(formGraphElementId(graphId, '30'), -30, -100);

        addOpenFileNodeAndValidate(formGraphElementId(graphId, '3r'), 'marks4.csv');
        zoomOut(2);
        moveNode(formGraphElementId(graphId, '3r'), 0, -100);

        addOpenFileNodeAndValidate(formGraphElementId(graphId, '4j'), 'marks5.csv');
        zoomOut(2);
        moveNode(formGraphElementId(graphId, '4j'), 30, -100);

        addOpenFileNodeAndValidate(formGraphElementId(graphId, '5c'), 'marks6.csv');
        zoomOut(2);
        moveNode(formGraphElementId(graphId, '5c'), 60, -100);

        addUnaryNodeAndConnect(
            graphId,
            '66', '5z', '7u', 'a8',
            -140, 0,
            'alias', {alias: 'class'}
        );

        addUnaryNodeAndConnect(
            graphId,
            'bj', 'bc', 'df', 'g4',
            -90, -50,
            'alias', {alias: 'lab1'}
        );

        addUnaryNodeAndConnect(
            graphId,
            'hk', 'hd', 'jo', 'mo',
            -60, -50,
            'alias', {alias: 'lab2'}
        );

        addUnaryNodeAndConnect(
            graphId,
            'o9', 'o2', 'ql', 'tw',
            -30, -50,
            'alias', {alias: 'lab3'}
        );

        addUnaryNodeAndConnect(
            graphId,
            'vm', 'vf', 'y6', '11s',
            0, -50,
            'alias', {alias: 'lab4'}
        );

        addUnaryNodeAndConnect(
            graphId,
            '13n', '13g', '16f', '1ac',
            30, -50,
            'alias', {alias: 'lab5'}
        );

        addUnaryNodeAndConnect(
            graphId,
            '1cc', '1c5', '1fc', '1jk',
            60, -50,
            'alias', {alias: 'lab6'}
        );

        addBinaryNodeAndConnect(
            graphId, '1lp', 'join_left', {onLeft: 'class.StudentNumber', onRight: 'lab1.StudentNumber'},
            -90, 0,
            [
                {fromId: '1li', toId: '1ox', edgeId: '1tg'},
                {fromId: '1tu', toId: '1xe', edgeId: '226'}
            ]
        );

        addBinaryNodeAndConnect(
            graphId, '24j', 'join_left', {onLeft: 'class.StudentNumber', onRight: 'lab2.StudentNumber'},
            -60, 0,
            [
                {fromId: '24i', toId: '285', edgeId: '2d8'},
                {fromId: '2dn', toId: '2hl', edgeId: '2mx'}
            ]
        );

        addBinaryNodeAndConnect(
            graphId, '2pi', 'join_left', {onLeft: 'class.StudentNumber', onRight: 'lab3.StudentNumber'},
            -30, 0,
            [
                {fromId: '2ph', toId: '2ti', edgeId: '2z5'},
                {fromId: '2zl', toId: '33x', edgeId: '39t'}
            ]
        );

        addBinaryNodeAndConnect(
            graphId, '3cm', 'join_left', {onLeft: 'class.StudentNumber', onRight: 'lab4.StudentNumber'},
            0, 0,
            [
                {fromId: '3cl', toId: '3h0', edgeId: '3n7'},
                {fromId: '3no', toId: '3se', edgeId: '3yu'}
            ]
        );

        addBinaryNodeAndConnect(
            graphId, '41v', 'join_left', {onLeft: 'class.StudentNumber', onRight: 'lab5.StudentNumber'},
            30, 0,
            [
                {fromId: '41u', toId: '46n', edgeId: '4de'},
                {fromId: '4dw', toId: '4j0', edgeId: '4ng'}
            ]
        );

        addBinaryNodeAndConnect(
            graphId, '4ta', 'join_left', {onLeft: 'class.StudentNumber', onRight: 'lab6.StudentNumber'},
            60, 0,
            [
                {fromId: '4t9', toId: '4yg', edgeId: '55r'},
                {fromId: '56a', toId: '5bs', edgeId: '5jc'}
            ]
        );

        addUnaryNodeAndConnect(
            graphId,
            '5mt', '5ms', '5sd', '608',
            60, 50,
            'take_columns',
            {columns: 'class.StudentNumber,Practical1,Practical2,Practical3,Practical4,Practical5,Practical6'}
        );

        addUnaryNodeAndConnect(
            graphId,
            '63u', '63t', '69m', '6hs',
            60, 100,
            'drop_alias',
            {}
        );

        addUnaryNodeAndConnect(
            graphId,
            '6lj', '6li', '6rj', '700',
            30, 100,
            'row_average',
            {columns: 'Practical1,Practical2,Practical3,Practical4,Practical5,Practical6', newName: 'Average'}
        );

        addUnaryNodeAndConnect(
            graphId,
            '73w', '73v', '7a4', '7iw',
            0, 100,
            'less_than_filter',
            {column: 'Average', condition: '45'}
        );

        addUnaryNodeAndConnect(
            graphId,
            '7mx', '7mw', '7td', '82g',
            -30, 100,
            'write_file',
            {name: 'AverageScores.csv'}
        );

        const downloadsFolder = Cypress.config('downloadsFolder')
        const downloadedFilename = path.join(downloadsFolder, 'ScoreLessThan45Result.zip')

        cy.get('#filename').type('ScoreLessThan45Result.zip');

        preventFormSubmitDefault("#processForm");
        cy.get('#processButton').click();

        verifyFile(downloadedFilename, ScoreLessThan45ExpectedData);
    });

    // test('save a query and reload to process');
});

function test(name, callback) {
    it(`${name}`, {
        defaultCommandTimeout: 10000
    }, () => {
        getGraphIdContext(callback);
    });
}

function getGraphIdContext(callback) {
    cy.getReact('t').getProps('instance').then(instance => {
        callback(instance.Ed.fe.split('_')[2]);
    });
}

function formGraphElementId(graphId, elementId) {
    return `path#ac_path_${graphId}_${elementId}`;
}

function addUnaryNodeAndConnect(graphId, addNodeId, fromId, toId, edgeId, x, y, nodeType, keyValuePairs) {
    addNodeAndValidate(formGraphElementId(graphId, addNodeId), nodeType, keyValuePairs);
    zoomOut(2);
    moveNode(formGraphElementId(graphId, addNodeId), x, y);
    addEdgeAndValidate(
        formGraphElementId(graphId, edgeId),
        formGraphElementId(graphId, fromId),
        formGraphElementId(graphId, toId)
    );
}

function addBinaryNodeAndConnect(graphId, addNodeId, nodeType, keyValuePairs, x, y, edges) {
    addNodeAndValidate(formGraphElementId(graphId, addNodeId), nodeType, keyValuePairs);
    zoomOut(2);
    moveNode(formGraphElementId(graphId, addNodeId), x, y);
    addEdgesAndValidate(graphId, edges);
}

function addNodeAndValidate(id, type, keyValuePairs) {
    cy.get('select#nodeOptions').select(type);
    cy.get('button#next').click();

    if (type === 'write_file') {
        cy.get(`input#nameTextInput`).type(`${keyValuePairs.name}`);
    } else {
        for(let [key, value] of Object.entries(keyValuePairs)) {
            cy.get(`input#${type}-${key}-input`).type(`${value}`);
        }
    }

    cy.get('button#addNode').click();

    cy.get('#root').then(root => {
        if (root.find('button#addNode').length > 0) {
            cy.get('button#addNode').click();
        }
    });

    checkPresence(id);
}

function addOpenFileNodeAndValidate(id, filepath) {
    cy.get('select#nodeOptions').select('open_file');
    cy.get('button#next').click();
    cy.get('input#fileInput').attachFile(filepath);
    cy.get('button#addNode').click();
    checkPresence(id);
}

function addEdgeAndValidate(edge, from, to) {
    cy.get(from).click({ force: true });
    cy.wait(1000);
    cy.get(from).click({ force: true });
    cy.get(to).click({ force: true });

    checkPresence(edge);
}

function addEdgesAndValidate(graphId, edges) {
    addEdgeAndValidate(
        formGraphElementId(graphId, edges[0].edgeId),
        formGraphElementId(graphId, edges[0].fromId),
        formGraphElementId(graphId, edges[0].toId)
    );
    cy.get(formGraphElementId(graphId, edges[1].fromId)).click();
    cy.get(formGraphElementId(graphId, edges[1].toId)).click();

    checkPresence(formGraphElementId(graphId, edges[1].edgeId));
}

function verifyFormContent(keyValuePairs) {
    for(let [key, value] of Object.entries(keyValuePairs)) {
        cy.get(`${key}`).should('have.value', value);
    }
}

function checkPresence(element) {
    cy.get(element);
}

function moveNode(htmlId, newX, newY) {
    cy.get(htmlId).move({
        deltaX: newX, deltaY: newY
    });
}

function checkMove(id, newX, newY) {
    cy.get(id).invoke('attr', 'transform').then(transform => {

        let transformSubStr = `${transform}`.substring(7, `${transform}`.length - 1);

        let dataParts = transformSubStr.split(',');

        expect(dataParts[4]).to.deep.equal(newX);
        expect(dataParts[5]).to.deep.equal(newY);
    });
}

function zoomOut(number) {
    for (let i = 0; i < number; i ++) {
        cy.get('.anychart-zoom-zoomOut').click();
    }
}

function payloadValidation(expectedData, actualData) {
    let datetime = [
        actualData[20],
        actualData[21],
        actualData[22],
        actualData[23],
        actualData[24],
        actualData[25],
        actualData[26],
        actualData[27]
    ];

    for (let i = 0; i < actualData.length; i++) {
        if (actualData[i] === expectedData[i]) continue;

        if (i >= 20 && i <= 27) continue; //datetime difference

        if (i < 7) assert.fail(0, 1,'zip stream content is not as expected at index: ' + i);
        else {
            let diffContents = [
                actualData[i - 7],
                actualData[i - 6],
                actualData[i - 5],
                actualData[i - 4],
                actualData[i - 3],
                actualData[i - 2],
                actualData[i - 1],
                actualData[i],
                actualData[i + 1],
                actualData[i + 2],
                actualData[i + 3],
                actualData[i + 4],
                actualData[i + 5],
                actualData[i + 6],
                actualData[i + 7]
            ];

            //check if subfile datetime difference by comparing to overall time stamp
            if (!hasSubArray(diffContents, datetime)) assert.fail(0, 1,'zip stream content is not as expected at index: ' + i);
        }
    }
}

function hasSubArray(master, sub) {
    return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
}

function preventFormSubmitDefault(selector) {
    cy.get(selector).then(form => {
        form.on("submit", e => {
            e.preventDefault();
        });
    });
}

function verifyFile(file, expectedData) {
    cy.readFile(file).then(str => {
        console.log(str);
        let data = [];
        let buffer = new Buffer(str, 'utf16le');
        for (let i = 0; i < buffer.length; i++) {
            data.push(buffer[i]);
        }
        console.log(data);
        payloadValidation(expectedData, data);
    });
}