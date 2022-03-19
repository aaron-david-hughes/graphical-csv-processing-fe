import Validation from "../Validation";

describe('Validation tests', () => {
    describe('validateTextField tests', () => {
        it('should return false when null event', () => {
            expect(!!Validation.validateTextField(null)).toEqual(false);
        });

        it('should return false when null event target', () => {
            expect(!!Validation.validateTextField({})).toEqual(false);
        });

        it('should return false when null event target value', () => {
            expect(!!Validation.validateTextField({target: {}})).toEqual(false);
        });

        it('should return false when empty event target value', () => {
            expect(!!Validation.validateTextField({target: {value: ''}})).toEqual(false);
        });

        it('should return false when whitespace event target value', () => {
            expect(!!Validation.validateTextField({target: {value: '     '}})).toEqual(false);
        });

        it('should return true when genuine event target value', () => {
            expect(!!Validation.validateTextField({target: {value: '   test  '}})).toEqual(true);
        });
    });

    describe('validateNumericField tests', () => {
        it('should return false if fails text checks', () => {
            expect(!!Validation.validateNumericField(null)).toEqual(false);
        });

        it('should return false if not a number', () => {
            expect(!!Validation.validateNumericField({target: {value: '3n'}})).toEqual(false);
        });

        it('should return true if number without whitespace', () => {
            expect(!!Validation.validateNumericField({target: {value: '3.2'}})).toEqual(true);
        });

        it('should return true if number with whitespace', () => {
            expect(!!Validation.validateNumericField({target: {value: ' 3.2 '}})).toEqual(true);
        });
    });

    describe('validateIntegerField tests', () => {
        it('should return false if fails numeric checks', () => {
            expect(!!Validation.validateIntegerField(null)).toEqual(false);
        });

        it('should return false if not an integer', () => {
            expect(!!Validation.validateIntegerField({target: {value: '3n'}})).toEqual(false);
        });

        it('should return true if integer without whitespace', () => {
            expect(!!Validation.validateIntegerField({target: {value: '3'}})).toEqual(true);
        });

        it('should return true if integer with whitespace', () => {
            expect(!!Validation.validateIntegerField({target: {value: ' 3 '}})).toEqual(true);
        });
    });
});