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
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IUser } from '../common/user.interface';
import { User } from '../decorators/user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { ClientKafka } from '@nestjs/microservices';
import { DIALOG_SERVICE } from '../kafka/kafka.const';
import { ResponseDto } from '../common/dto/response.dto';
import { firstValueFrom } from 'rxjs';
import { IDialogMessage } from '../common/dialog-message.interface';
import { DialogRedisService } from '../redis/services/dialog-redis.service';

@Controller('dialog')
export class DialogController implements OnModuleInit {
  constructor(
    @Inject(DIALOG_SERVICE) private readonly dialogClient: ClientKafka,
    private readonly dialogRedisService: DialogRedisService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get(':user_id/list-v2')
  async getDialogV2(@User() user: IUser, @Param('user_id', ParseUUIDPipe) user_id: string, @Res() res: FastifyReply) {
    try {
      const serializedData = await this.dialogRedisService.getMessagesFromDialog(user.id, user_id);
      res.type('application/json'); // Устанавливаем Content-Type как application/json
      return res.send(serializedData); // Отправляем сериализованные данные напрямую
    } catch (err) {
      throw new InternalServerErrorException(err.message ?? 'Internal server error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':user_id/send-v2')
  @HttpCode(200)
  async sendMessageV2(
    @User() user: IUser,
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    try {
      const result = await this.dialogRedisService.sendMessageToDialog(user.id, user_id, sendMessageDto.text);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err.message ?? 'Internal server error');
    }
  }
}
