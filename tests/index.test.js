jest.mock('express');
jest.mock('../app/logger');
jest.mock('../app/routes');

require('../index');

describe('index', () => {
    it('should work', () => {
    });
});
