function validateTextField(e) {
    return e && e.target && e.target.value && e.target.value.length > 0 && /\S/.test(e.target.value);
}

function validateNumericField(e) {
    return validateTextField(e) && !isNaN(e.target.value);
}

function validateIntegerField(e) {
    return validateNumericField(e) && Number.isInteger(Number(e.target.value)) && !e.target.value.includes('.');
}

function validateTextContent(str) {
    return str && str.trim().length > 0;
}

let Validation = {
    validateTextField,
    validateNumericField,
    validateIntegerField,
    validateTextContent
};

export default Validation;