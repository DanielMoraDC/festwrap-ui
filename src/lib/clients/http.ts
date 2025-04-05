/* eslint-disable no-unused-vars */
import axios from 'axios';

export enum Method {
  Get = 'GET',
  Post = 'POST',
}

export interface HttpRequest {
  url: string;
  method: Method;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  data?: Record<string, any>;
}

export interface HttpClient {
  send(_request: HttpRequest): Promise<HttpResponse>;
}

export interface HttpResponse {
  data: any;
  status: number;
}

export class HttpBaseClient implements HttpClient {
  async send({
    url,
    method,
    params,
    headers,
    data,
  }: HttpRequest): Promise<HttpResponse> {
    return axios({
      url,
      method,
      params,
      headers,
      data,
    }).then((response) => {
      return {
        data: response.data,
        status: response.status,
      };
    });
  }
}

export class FakeHttpClient implements HttpClient {
  private sendErrorMessage: string | undefined = undefined;
  private result: HttpResponse;

  constructor(result: HttpResponse = { data: {}, status: 200 }) {
    this.result = result;
  }

  setResult(result: HttpResponse) {
    this.result = result;
  }

  setSendErrorMessage(message: string) {
    this.sendErrorMessage = message;
  }

  async send(..._: any[]): Promise<HttpResponse> {
    if (this.sendErrorMessage !== undefined) {
      throw new Error(this.sendErrorMessage);
    }
    return this.result;
  }
}
