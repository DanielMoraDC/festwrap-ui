export interface IFetchService {
  fetchData<T>(_url: string, _options?: RequestInit): Promise<T>;
}

export class FetchService implements IFetchService {
  async fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  }
}
