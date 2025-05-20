import { FetcherService } from '@/infrastructure/services/fetcher/fetcher.service';
import { GoogleApiModule } from '../google-api/google-api.module';
import { GoogleSheetsUseCase } from '@/app/use-cases/google-sheets/google-sheets.use-case';
import { Module } from '@nestjs/common';
import { PrepareDataService } from '@/infrastructure/services/prepare-data/prepare-data.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [GoogleApiModule],
  providers: [GoogleSheetsUseCase, PrepareDataService, FetcherService],
  exports: [GoogleSheetsUseCase],
})
export class UseCasesModule {}
