import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_SRC } from '../redis.const';
import * as fsp from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DialogRedisService implements OnModuleInit {
  constructor(@Inject(REDIS_SRC) private readonly redisClient: Redis) {}

  async onModuleInit() {
    // define all required commands
    await this.defineCommandFromFile('send-message-to-dialog.lua', 'sendMessageToDialog', 0);
    await this.defineCommandFromFile('get-messages-from-dialog.lua', 'getMessagesFromDialog', 0);
  }

  private async defineCommandFromFile(fileName: string, commandName: string, numberOfKeys: number) {
    const scriptsDir = path.join(__dirname, '../lua-scripts');
    const filePath = path.join(scriptsDir, fileName);
    const script = await fsp.readFile(filePath, 'utf8');
    this.redisClient.defineCommand(commandName, {
      numberOfKeys,
      lua: script,
    });
  }

  public async sendMessageToDialog(from: string, to: string, text: string): Promise<string> {
    const result = await this.redisClient.sendMessageToDialog(from, to, text);
    return result;
  }

  public async getMessagesFromDialog(from: string, to: string): Promise<any> {
    const result = await this.redisClient.getMessagesFromDialog(from, to);
    return result;
  }
}
