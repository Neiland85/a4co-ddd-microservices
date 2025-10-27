interface Interceptor<T> {
  (data: T): T | Promise<T>;
}

export class FetchWrapper {
  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return fetch(input, init);
  }
}

export class FetchWrapperWithInterceptors extends FetchWrapper {
  private requestInterceptors: Array<(config: RequestInit) => RequestInit | Promise<RequestInit>> =
    [];
  private responseInterceptors: Array<(response: Response) => Response | Promise<Response>> = [];

  addRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: (response: Response) => Response | Promise<Response>): void {
    this.responseInterceptors.push(interceptor);
  }

  override async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    let config = init || {};
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const response = await super.fetch(input, config);
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }

    return finalResponse;
  }
}
