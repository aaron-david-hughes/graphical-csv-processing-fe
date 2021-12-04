function validateTextField(e) {
    return e && e.target && e.target.value && e.target.value.length > 0;
}

function validateEdgePairing(edgeObj, existingEdgeList) {
    if (!existingEdgeList || !edgeObj || !edgeObj.from || !edgeObj.to) {
        return undefined;
    }

    if (edgeObj.from === edgeObj.to) {
        return `'From' & 'To' cannot be the same node: ${edgeObj.from}`
    }

    let relevantEdges = existingEdgeList.filter(edge => edge.from === edgeObj.from || edge.from === edgeObj.to);

    if (!!relevantEdges.find(edge => edge.to === edgeObj.to || edge.to === edgeObj.from)) {
        return `Only one edge may exist between two nodes: ${edgeObj.from} and ${edgeObj.to}`;
    }

    return 'valid';
}

let Validation = {
    validateTextField,
    validateEdgePairing
};

export default Validation;