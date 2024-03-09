import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  OnModuleInit,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IUser } from '../common/user.interface';
import { User } from '../decorators/user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { ClientKafka } from '@nestjs/microservices';
import { DIALOG_SERVICE } from '../kafka/kafka.const';
import { ResponseDto } from '../common/dto/response.dto';
import { firstValueFrom } from 'rxjs';
import { IDialogMessage } from '../common/dialog-message.interface';

@Controller('dialog')
export class DialogController implements OnModuleInit {
  constructor(@Inject(DIALOG_SERVICE) private readonly dialogClient: ClientKafka) {}

  onModuleInit() {
    this.dialogClient.subscribeToResponseOf('get_dialog_list');
    this.dialogClient.subscribeToResponseOf('send_message_to_user');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':user_id/list')
  async getDialog(@User() user: IUser, @Param('user_id', ParseUUIDPipe) user_id: string) {
    const response = await firstValueFrom(
      this.dialogClient.send<ResponseDto<IDialogMessage[]>>('get_dialog_list', { from: user.id, to: user_id }),
    );
    if (response?.status === 200) {
      return response.data;
    } else {
      // Генерация ошибки с использованием throwError
      throw new InternalServerErrorException(response.message ?? 'Internal server error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':user_id/send')
  @HttpCode(200)
  async sendMessage(
    @User() user: IUser,
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const response = await firstValueFrom(
      this.dialogClient.send<ResponseDto>('send_message_to_user', {
        from: user.id,
        to: user_id,
        text: sendMessageDto.text,
      }),
    );

    if (response?.status === 200) {
      return response.data;
    } else {
      // Генерация ошибки с использованием throwError
      throw new InternalServerErrorException(response.message ?? 'Internal server error');
    }
  }
}
