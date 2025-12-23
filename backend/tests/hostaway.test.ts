import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';

describe('Hostaway reviews API', () => {
  it('returns aggregated review summary', async () => {
    const response = await request(app).get('/api/reviews/hostaway');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.summary.totalProperties).toBeGreaterThan(0);
    expect(response.body.data.properties.length).toBeGreaterThan(0);
  });

  it('filters by listing id', async () => {
    const listingId = 253093;
    const response = await request(app).get('/api/reviews/hostaway').query({ listingId });

    expect(response.status).toBe(200);
    const { properties } = response.body.data;
    expect(properties.every((property: { listingId: number }) => property.listingId === listingId)).toBe(true);
  });

  it('persists review selections', async () => {
    const payload = { selectedIds: [7453, 7455] };
    const saveResponse = await request(app).post('/api/reviews/selection').send(payload);
    expect(saveResponse.status).toBe(200);
    expect(saveResponse.body.selectedIds).toEqual(payload.selectedIds);

    const getResponse = await request(app).get('/api/reviews/selection');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.selectedIds).toEqual(payload.selectedIds);
  });
});

