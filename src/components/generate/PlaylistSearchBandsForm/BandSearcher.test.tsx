import { beforeEach, describe, it, expect, vi, assert } from 'vitest';
import { NonPaginatedBandSearcher } from './BandSearcher';

describe('NonPaginatedBandSearcher', () => {
  const okResponse: Response = {
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        artists: [
          { name: 'Have Heart' },
          { name: 'Heaven Shall Burn', imageUri: 'http://some_uri.com' },
        ],
      }),
  } as Response;

  const emptyOkResponse: Response = {
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  } as Response;

  const errorResponse: Response = {
    ok: false,
    status: 400,
    json: () => Promise.resolve('Test error'),
  } as Response;

  function mockFetch(response: Response) {
    global.fetch = vi.fn(() => Promise.resolve(response));
  }

  beforeEach(() => mockFetch(okResponse));

  it('should fetch the url with the provided configuration', async () => {
    const searcher = new NonPaginatedBandSearcher(
      'https://some_host',
      'some_token',
      2
    );

    await searcher.searchArtists('H');

    expect(fetch).toHaveBeenCalledWith(
      'https://some_host/api/artists/search?name=H&token=some_token&limit=2'
    );
  });

  it('should return the fetched bands with the provided image config', async () => {
    const searcher = new NonPaginatedBandSearcher(
      'https://some_host',
      'some_token',
      2,
      { height: 21, width: 18 }
    );

    const actual = await searcher.searchArtists('H');

    const expected = [
      { id: 'Have Heart', title: 'Have Heart' },
      {
        id: 'Heaven Shall Burn_http://some_uri.com',
        title: 'Heaven Shall Burn',
        icon: { src: 'http://some_uri.com', height: 21, width: 18 },
      },
    ];
    assert.deepEqual(actual, expected);
  });

  it('should return an error if request results into an error', async () => {
    mockFetch(errorResponse);
    const searcher = new NonPaginatedBandSearcher(
      'https://some_host',
      'some_token',
      2
    );

    await expect(searcher.searchArtists('H')).rejects.toThrow();
  });

  it('should return an error if response contains no bands', async () => {
    mockFetch(emptyOkResponse);
    const searcher = new NonPaginatedBandSearcher(
      'https://some_host',
      'some_token',
      2
    );

    await expect(searcher.searchArtists('H')).rejects.toThrow();
  });
});
