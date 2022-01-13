function validateTextField(e) {
    return e && e.target && e.target.value && e.target.value.length > 0;
}

function validateTextContent(str) {
    return str && str.trim().length > 0;
}

let Validation = {
    validateTextField,
    validateTextContent
};

export default Validation;