import { FetcherService } from '@/infrastructure/services/fetcher/fetcher.service';
import { Module } from '@nestjs/common';
import { PrepareDataService } from '@/infrastructure/services/prepare-data/prepare-data.service';

@Module({
  imports: [],
  providers: [PrepareDataService, FetcherService],
  exports: [PrepareDataService],
})
export class ServicesModule {}
