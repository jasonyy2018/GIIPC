/**
 * Jest Setup File
 * Configures global test environment
 */

// Make jest globals available
global.jest = (await import('@jest/globals')).jest;
global.expect = (await import('@jest/globals')).expect;
global.describe = (await import('@jest/globals')).describe;
global.test = (await import('@jest/globals')).test;
global.beforeEach = (await import('@jest/globals')).beforeEach;
global.afterEach = (await import('@jest/globals')).afterEach;
global.beforeAll = (await import('@jest/globals')).beforeAll;
global.afterAll = (await import('@jest/globals')).afterAll;
