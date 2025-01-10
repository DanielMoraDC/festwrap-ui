import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const scope =
  'playlist-modify-private playlist-modify-public playlist-read-private user-read-email';

async function refreshAccessToken(
  token: any,
  clientId: string,
  clientSecret: string
) {
  // See https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
  const url = 'https://accounts.spotify.com/api/token';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: clientId,
    }),
  };
  const body = await fetch(url, payload);
  if (!body.ok) {
    throw new Error('Could not refresh access token');
  }

  const response = await body.json();
  return {
    ...token,
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires_at: Date.now() + response.expires_in * 1000,
  };
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET as string,
      authorization: {
        params: {
          scope,
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: any) {
      // See https://authjs.dev/guides/refresh-token-rotation
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at * 1000,
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < token.expires_at) {
        // Non-first-time login, token not expired, yet
        return token;
      } else {
        // Token has expired, need to refresh
        return await refreshAccessToken(
          token,
          process.env.SPOTIFY_CLIENT_ID as string,
          process.env.SPOTIFY_SECRET as string
        );
      }
    },
    async session({ session, token }: any) {
      session.user = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
