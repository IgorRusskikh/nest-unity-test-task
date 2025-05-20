import { Injectable } from '@nestjs/common';

@Injectable()
export class FetcherService {
  private readonly maxRetries = 3;
  private readonly retryDelay = 3000;

  constructor() {}

  async fetchData<T>(
    { url, options }: { url: string; options: RequestInit },
    retries = 0,
  ): Promise<T> {
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        if (retries < this.maxRetries) {
          await this.delay(this.retryDelay);
          return this.fetchData({ url, options }, retries + 1);
        }
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (retries < this.maxRetries) {
        console.log(`Retrying after error... (${retries + 1})`);
        await this.delay(this.retryDelay);
        return this.fetchData({ url, options }, retries + 1);
      }

      throw error;
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
