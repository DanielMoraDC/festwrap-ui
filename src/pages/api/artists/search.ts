import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { Artist } from '@/lib/artists';
import { ArtistsClient, ArtistsHTTPClient } from '@/lib/clients/artists';
import { getToken } from 'next-auth/jwt';
import { BaseHTTPAuthHeaderBuilder } from '@/lib/clients/auth';

export type SearchArtistHandlerParams = {
  client: ArtistsClient;
  defaultLimit: number;
  maxLimit: number;
};

type ResponseArtist = {
  name: string;
  imageUri: string | undefined;
};

type ResponseData = {
  message: string;
  artists?: ResponseArtist[];
};

function searchQuerySchema(defaultLimit: number, maxLimit: number) {
  const limitMessage = `"limit" should be a number in interval [1, ${maxLimit}]`;
  return z.object({
    name: z.string({
      message: '"name" should be provided as a string',
    }),
    limit: z.coerce
      .number({
        message: limitMessage,
      })
      .gt(1, {
        message: limitMessage,
      })
      .lte(maxLimit, {
        message: limitMessage,
      })
      .default(defaultLimit),
  });
}

export function createSearchArtistHandler({
  client,
  defaultLimit,
  maxLimit,
}: SearchArtistHandlerParams) {
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<ResponseData>
  ): Promise<void> {
    const parsedArgs = searchQuerySchema(defaultLimit, maxLimit).safeParse(
      request.query
    );
    if (!parsedArgs.success) {
      response
        .status(400)
        .json({ message: parsedArgs.error.errors[0].message });
      return;
    }

    const token = await getToken({ req: request });

    if (!token) {
      response.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, limit } = parsedArgs.data;

    try {
      const searchResults = await client.searchArtists(
        token.accessToken,
        name,
        limit
      );
      response.status(200).json({
        artists: searchResults.map((artist: Artist) => ({
          name: artist.getName(),
          imageUri: artist.getImageUri(),
        })),
        message: 'Artists successfully retrieved',
      });
    } catch {
      response
        .status(500)
        .json({ message: 'Unexpected error, cannot retrieve artists' });
    }
  };
}

const defaultLimit: number = parseInt(
  process.env.SEARCH_ARTISTS_DEFAULT_LIMIT || '5'
);
const maxLimit: number = parseInt(process.env.SEARCH_ARTISTS_MAX_LIMIT || '10');
const serverHost: string = process.env.SERVER_HOST || 'http://localhost';
const serverPort: number = parseInt(process.env.SERVER_PORT || '8080');
const httpClient: HttpClient = new HttpBaseClient();
const httpAuthHeaderBuilder = new BaseHTTPAuthHeaderBuilder();
const client: ArtistsClient = new ArtistsHTTPClient(
  `${serverHost}:${serverPort}`,
  httpClient,
  httpAuthHeaderBuilder
);
const searchArtistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createSearchArtistHandler({ client, defaultLimit, maxLimit });
export default searchArtistHandler;
