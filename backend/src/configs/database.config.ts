import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from '../database/database.interface';

export const getDatabaseConfig = async (configService: ConfigService): Promise<IDatabaseConfig> => {
  const pgMasterConfig = {
    host: configService.get('DB_YELLOW_HOST') || 'localhost',
    port: configService.get('DB_YELLOW_PORT') || 5432,
    user: configService.get('DB_USER') || 'admin',
    password: configService.get('DB_PASSWORD') || 'admin',
    database: configService.get('DB_NAME') || 'social_web',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
  };

  const pgReplicaConfig = {
    host: configService.get('DB_BLUE_HOST') || 'localhost',
    port: configService.get('DB_BLUE_PORT') || 5432,
    user: configService.get('DB_USER') || 'admin',
    password: configService.get('DB_PASSWORD') || 'admin',
    database: configService.get('DB_NAME') || 'social_web',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
  };

  return { pgMasterConfig, pgReplicaConfig };
};
