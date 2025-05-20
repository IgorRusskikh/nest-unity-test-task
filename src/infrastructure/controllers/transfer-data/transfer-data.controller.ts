import { Controller, Get } from '@nestjs/common';

import { GoogleSheetsUseCase } from '@/app/use-cases/google-sheets/google-sheets.use-case';

@Controller('transfer-data')
export class TransferDataController {
  constructor(private readonly googleSheetsUseCase: GoogleSheetsUseCase) {}

  @Get()
  async transferData() {
    const res = await this.googleSheetsUseCase.fillData();

    return res;
  }
}
