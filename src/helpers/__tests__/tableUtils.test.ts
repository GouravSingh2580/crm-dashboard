import { getTableResultText, getTotalPages } from '../tableUtils';

describe('Table utils test', () => {
    it('should output from, to and total for displaying table info', () => {
        const size = 20;
        const page = 1;
        const total = 387;
        const template = '{from} - {to} of {total} Results';
        const result = getTableResultText(size, page, total, template);
        expect(result).toBe('1 - 20 of 387 Results');
    });

    it('should output from, to and total for displaying table info in case of no data', () => {
        const size = 20;
        const page = 1;
        const total = 0;
        const template = '{from} - {to} of {total} Results';
        const result = getTableResultText(size, page, total, template);
        expect(result).toBe('0 - 0 of 0 Results');
    });

    it('should return total pages', () => {
        const size = 20;
        const total = 387;
        const result = getTotalPages(size, total);
        expect(result).toBe(20);
    });

    it('should return total pages in case of no data', () => {
        const size = 20;
        const total = 0;
        const result = getTotalPages(size, total);
        expect(result).toBe(0);
    });
});
