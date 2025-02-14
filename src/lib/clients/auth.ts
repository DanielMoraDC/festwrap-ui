import { HttpClient, Method } from './http';

export interface AuthClient {
  getToken(): Promise<string>;
  getHeaderName(): string;
}

export class HTTPAuthClient {
  private httpClient: HttpClient;
  private baseUrl: string =
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity';
  private audience: string;

  constructor(httpClient: HttpClient, audience: string) {
    this.httpClient = httpClient;
    this.audience = audience;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getToken(): Promise<string> {
    return this.httpClient
      .send({
        url: this.baseUrl,
        method: Method.Get,
        params: { audience: this.audience },
        headers: { 'Metadata-Flavor': 'Google' },
      })
      .then((response) => response.data);
  }

  getHeaderName(): string {
    return 'X-Serverless-Authorization';
  }
}

export class FakeAuthClient {
  private header: string;
  private token: string;
  private getTokenErrorMessage: string | undefined = undefined;

  constructor(token: string, header: string) {
    this.token = token;
    this.header = header;
  }

  setToken(token: string) {
    this.token = token;
  }

  setGetTokenErrorMessage(message: string) {
    this.getTokenErrorMessage = message;
  }

  async getToken(): Promise<string> {
    if (this.getTokenErrorMessage !== undefined) {
      throw new Error(this.getTokenErrorMessage);
    }
    return this.token;
  }

  getHeaderName(): string {
    return this.header;
  }
}

export interface HTTPAuthHeaderBuilder {
  buildHeader: (_token: string) => Promise<Record<string, string>>;
}

export class BaseHTTPAuthHeaderBuilder implements HTTPAuthHeaderBuilder {
  private gcpAuthClient?: AuthClient | undefined;

  constructor(gcpAuthClient?: AuthClient) {
    this.gcpAuthClient = gcpAuthClient;
  }

  async buildHeader(token: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (!this.gcpAuthClient) return headers;

    return {
      ...headers,
      [this.gcpAuthClient.getHeaderName()]: `Bearer ${await this.gcpAuthClient.getToken()}`,
    };
  }
}

export class FakeBaseHTTPAuthHeaderBuilder implements HTTPAuthHeaderBuilder {
  private gcpAuthToken: string | undefined;
  private gcpAuthHeaderName: string | undefined;

  constructor(gcpAuthToken?: string, gcpAuthHeaderName?: string) {
    this.gcpAuthToken = gcpAuthToken;
    this.gcpAuthHeaderName = gcpAuthHeaderName;
  }

  async buildHeader(token: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    if (!this.gcpAuthToken || !this.gcpAuthHeaderName) return headers;

    return {
      ...headers,
      [this.gcpAuthHeaderName]: `Bearer ${this.gcpAuthToken}`,
    };
  }
}
