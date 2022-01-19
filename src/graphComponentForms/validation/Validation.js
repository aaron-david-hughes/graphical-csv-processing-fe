function validateTextField(e) {
    return e && e.target && e.target.value && e.target.value.length > 0 && /\S/.test(e.target.value);
}

function validateTextContent(str) {
    return str && str.trim().length > 0;
}

let Validation = {
    validateTextField,
    validateTextContent
};

export default Validation;