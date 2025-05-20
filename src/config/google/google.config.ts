import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class GoogleConfig {
  public readonly authClient: JWT;
  private readonly scopes = ['https://www.googleapis.com/auth/spreadsheets'];

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    const credentialsPath = this.configService.get<string>(
      'GOOGLE_API_KEYS_PATH',
    );
    const fullCredentialsPath = join(process.cwd(), credentialsPath);
    const credentials = JSON.parse(readFileSync(fullCredentialsPath, 'utf8'));

    this.authClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: this.scopes,
    });

    this.logger.log('[GOOGLE CONFIG] Google auth client initialized');
  }
}
