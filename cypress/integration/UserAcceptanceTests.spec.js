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

    test('load graph - the list of people and count who scored less than 45', () => {
        cy.get('button#loadButton').click();
        cy.get('input#loadGraphFileInput').attachFile('ScoreLessThan45.json');

        const downloadsFolder = Cypress.config('downloadsFolder')
        const downloadedFilename = path.join(downloadsFolder, 'ScoreLessThan45Result.zip')

        cy.get('#filename').type('ScoreLessThan45Result.zip');

        preventFormSubmitDefault("#processForm");
        cy.get('#processButton').click();

        verifyFile(downloadedFilename, ScoreLessThan45ExpectedData);
    });
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

function addEdgeAndValidate(edge, from, to) {
    cy.get(from).click({ force: true });
    cy.wait(1000);
    cy.get(from).click({ force: true });
    cy.get(to).click({ force: true });

    checkPresence(edge);
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