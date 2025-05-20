import { ConfigService } from '@nestjs/config';
import { FetcherService } from '@/infrastructure/services/fetcher/fetcher.service';
import { GoogleConfig } from '@/config/google/google.config';
import { GoogleSheetsService } from '@/infrastructure/services/google-sheets/google-sheets.service';
import { GoogleSheetsUseCase } from '@/app/use-cases/google-sheets/google-sheets.use-case';
import { Logger } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { PrepareDataService } from '@/infrastructure/services/prepare-data/prepare-data.service';

@Module({
  imports: [],
  providers: [
    ConfigService,
    Logger,
    GoogleConfig,
    GoogleSheetsService,
    GoogleSheetsUseCase,
    PrepareDataService,
    FetcherService,
  ],
  exports: [GoogleConfig, GoogleSheetsService, GoogleSheetsUseCase],
})
export class GoogleApiModule {}
