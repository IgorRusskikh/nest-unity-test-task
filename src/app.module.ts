import { ConfigModule } from '@nestjs/config';
import { ControllersModule } from '@modules/controllers/controllers.module';
import { GoogleApiModule } from '@modules/google-api/google-api.module';
import { Module } from '@nestjs/common';
import { ServicesModule } from './infrastructure/modules/services/services.module';
import { UseCasesModule } from './infrastructure/modules/use-cases/use-cases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServicesModule,
    GoogleApiModule,
    UseCasesModule,
    ControllersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
