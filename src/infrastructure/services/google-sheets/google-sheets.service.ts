import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';

import { GoogleConfig } from '@/config/google/google.config';

@Injectable()
export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private readonly sheetId = '1nl9nTv3qjhu-iFy7kBSzdrxSy-ypprurmxdoluFk5SY';

  constructor(
    private readonly logger: Logger,
    private readonly googleConfig: GoogleConfig,
  ) {
    this.sheets = google.sheets({
      version: 'v4',
      auth: this.googleConfig.authClient,
    });

    this.logger.log('[GOOGLE SHEETS] Google sheets client initialized');
  }

  async getSheetTitles(spreadsheetId: string): Promise<string[]> {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetTitles = response.data.sheets?.map(
      (sheet) => sheet.properties?.title,
    );

    return sheetTitles;
  }

  async getSheetValues() {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: 'ВА!B5:D10',
      auth: this.googleConfig.authClient,
    });

    const rows = res.data.values || [];

    this.logger.log('[GOOGLE SHEETS] Sheet values:', rows);

    return rows;
  }

  async getCellsValues({ sheetId, range }: { sheetId: string; range: string }) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
      });

      const rows = response.data.values;

      return rows;
    } catch (error) {
      this.logger.error(
        `[GOOGLE SHEETS] Error getting cells values: ${error.message}`,
      );

      return [];
    }
  }

  async writeToSheet({
    sheetId,
    range,
    values,
  }: {
    sheetId: string;
    range: string;
    values: (string | number)[][];
  }) {
    const resource = {
      values,
    };

    try {
      const result = await this.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: resource,
        auth: this.googleConfig.authClient,
      });

      this.logger.log(
        `[GOOGLE SHEETS] Updated cells: ${result.data.updatedCells}`,
      );

      return result.data;
    } catch (error) {
      this.logger.error(
        `[GOOGLE SHEETS] Error writing to sheet: ${error.message}`,
      );

      return null;
    }
  }
}
