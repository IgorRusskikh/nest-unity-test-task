import { Injectable, OnModuleInit } from '@nestjs/common';

import { GoogleSheetsService } from '@/infrastructure/services/google-sheets/google-sheets.service';
import { PrepareDataService } from '@/infrastructure/services/prepare-data/prepare-data.service';
import { PreparedData } from '@/common/interfaces/prepared-data.interface';

@Injectable()
export class GoogleSheetsUseCase {
  private readonly sheetId = '1nl9nTv3qjhu-iFy7kBSzdrxSy-ypprurmxdoluFk5SY';

  constructor(
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly prepareDataService: PrepareDataService,
  ) {}

  async fillData() {
    const preparedData = await this.prepareDataService.getData();
    const dataToFill: (string | number)[][] = [];

    for (const row of preparedData) {
      const dataToFillRow: (string | number)[] = [];

      const sortedData = row.data.sort(
        (a, b) => a.Year - b.Year || a.Month - b.Month,
      );

      const years = [...new Set(sortedData.map((item) => item.Year))].sort();

      while (years.length < 2) {
        const first = years[0] || new Date().getFullYear();
        years.unshift(first - 1);
      }

      const targetYears = years.slice(-2);

      const fullDateRange = [];
      for (const year of targetYears) {
        for (let month = 1; month <= 12; month++) {
          fullDateRange.push({ year, month });
        }
      }

      const dateMap = new Map<
        string,
        { Plan: string | number; Fact: string | number }
      >();

      for (const entry of sortedData) {
        const monthStr = entry.Month.toString().padStart(2, '0');
        const key = `${entry.Year}-${monthStr}`;
        dateMap.set(key, {
          Plan: typeof entry.Plan === 'number' ? entry.Plan : '',
          Fact: typeof entry.Fact === 'number' ? entry.Fact : '',
        });
      }

      for (const { year, month } of fullDateRange) {
        const monthStr = month.toString().padStart(2, '0');
        const key = `${year}-${monthStr}`;
        const val = dateMap.get(key);

        if (val) {
          dataToFillRow.push(val.Plan, val.Fact);
        } else {
          dataToFillRow.push('', '');
        }
      }

      dataToFill.push(dataToFillRow);
    }

    const sheetsTitles = (
      await this.googleSheetsService.getSheetTitles(this.sheetId)
    ).slice(1);

    for (const sheetTitle of sheetsTitles) {
      const rawKeys = await this.googleSheetsService.getCellsValues({
        sheetId: this.sheetId,
        range: `'${sheetTitle}'!B8:B10`,
      });

      const keys = rawKeys.map((row) => row[0]);

      const filteredData = preparedData
        .filter((item) => keys.includes(item.ObjectName))
        .sort(
          (a, b) => keys.indexOf(a.ObjectName) - keys.indexOf(b.ObjectName),
        );

      const promises = filteredData.map((item, index) => {
        const rowIndex = preparedData.findIndex(
          (row) => row.ObjectName === item.ObjectName,
        );
        const rowData = dataToFill[rowIndex];

        return this.googleSheetsService.writeToSheet({
          sheetId: this.sheetId,
          range: `'${sheetTitle}'!G${8 + index}:BB${8 + index}`,
          values: [rowData],
        });
      });

      await Promise.all(promises);
    }

    return {
      message: 'Data filled successfully',
    };
  }

  orderData(keyValues: string[][], preparedData: PreparedData[]) {
    if (!keyValues.length) {
      throw new Error('No key values found');
    }

    const keys = keyValues.map((item) => item[0]);

    const orderedData = preparedData.sort((a, b) => {
      const aIndex = keys.indexOf(a.ObjectName);
      const bIndex = keys.indexOf(b.ObjectName);

      return (
        (aIndex === -1 ? Infinity : aIndex) -
        (bIndex === -1 ? Infinity : bIndex)
      );
    });

    return orderedData;
  }
}
