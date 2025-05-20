import { ApiResponseData } from '@/common/interfaces/api-response-data.interface';
import { FetcherService } from '../fetcher/fetcher.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrepareDataService {
  private readonly url = `https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkYuOo-xQTiztOk65nCjzw2g1q9PGTXvseQUYvkgzgSoWZItlXI4aB945KExQP2VDXZRHrblsD1GAzFQTeivuhzLe8WMkaoWnhmpTAcGkYT4e2eZRPNN8USS7K2SjA64FY37TckUgQ_-cPuILpbdRV7-w_6jPWpR8B2zy26v_jhdq8EKRhwCh1NlP0gzMXTxtuHE9qWvHFNnjm00liOY9fVcX4HzGe-kXrcc6-SLjBHjsmCCxGU2hD75QvnDR_fqrUk6wo1Evph2YdvDiTTSMrDmxz6B1gMzXV81vsSAGZ_daVgiBxi4ChfWWO10QUqGXTAS7JORb99iOaZxqE3m8SQ-dfDVy7tN8Ana7GlSpyTunRji8&lib=MJoCCRzvOuutnE4wxzvfXyxjH-oME6c33`;

  constructor(private readonly fetcherService: FetcherService) {}

  async getData(): Promise<
    {
      ObjectName: string;
      data: ApiResponseData[];
    }[]
  > {
    const data = await this.fetcherService.fetchData<ApiResponseData[]>({
      url: this.url,
      options: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });

    const structuredData = this.structureData(data);

    return structuredData;
  }

  private structureData(
    data: ApiResponseData[],
  ): { ObjectName: string; data: ApiResponseData[] }[] {
    const strucuturedData = [];
    const sheetsSet = new Set<string>();

    for (const record of data) {
      sheetsSet.add(record.ObjectName);
    }

    for (const sheet of sheetsSet) {
      const sheetData = data
        .filter((item) => item.ObjectName.startsWith(sheet))
        .sort((a, b) => a.Month - b.Month && a.Year - b.Year);

      strucuturedData.push({
        ObjectName: sheet,
        data: sheetData,
      });
    }

    return strucuturedData;
  }
}
