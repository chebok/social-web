import { Module } from '@nestjs/common';
import { DialogController } from './dialog.controller';

@Module({
  controllers: [DialogController],
})
export class DialogModule {}
