"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../src/app"));
(0, vitest_1.describe)('Hostaway reviews API', () => {
    (0, vitest_1.it)('returns aggregated review summary', async () => {
        const response = await (0, supertest_1.default)(app_1.default).get('/api/reviews/hostaway');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.status).toBe('success');
        (0, vitest_1.expect)(response.body.data.summary.totalProperties).toBeGreaterThan(0);
        (0, vitest_1.expect)(response.body.data.properties.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('filters by listing id', async () => {
        const listingId = 253093;
        const response = await (0, supertest_1.default)(app_1.default).get('/api/reviews/hostaway').query({ listingId });
        (0, vitest_1.expect)(response.status).toBe(200);
        const { properties } = response.body.data;
        (0, vitest_1.expect)(properties.every((property) => property.listingId === listingId)).toBe(true);
    });
    (0, vitest_1.it)('persists review selections', async () => {
        const payload = { selectedIds: [7453, 7455] };
        const saveResponse = await (0, supertest_1.default)(app_1.default).post('/api/reviews/selection').send(payload);
        (0, vitest_1.expect)(saveResponse.status).toBe(200);
        (0, vitest_1.expect)(saveResponse.body.selectedIds).toEqual(payload.selectedIds);
        const getResponse = await (0, supertest_1.default)(app_1.default).get('/api/reviews/selection');
        (0, vitest_1.expect)(getResponse.status).toBe(200);
        (0, vitest_1.expect)(getResponse.body.selectedIds).toEqual(payload.selectedIds);
    });
});
//# sourceMappingURL=hostaway.test.js.map