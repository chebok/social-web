import { Controller } from '@nestjs/common';
import { Ctx, Payload, KafkaContext, MessagePattern } from '@nestjs/microservices';
import { DialogService } from './dialog.service';
import { CreateDialogMessageDto } from './dto/create-message.dto';
import { GetDialogListDto } from './dto/get-dialog-list.dto';
import { ResponseDto } from '../common/dto/response.dto';
import { IDialogMessage } from '../common/dialog-message.interface';

@Controller()
export class DialogController {
  constructor(private readonly dialogService: DialogService) {}

  @MessagePattern('send_message_to_user')
  async createDialogMessage(
    @Payload() { from, to, text }: CreateDialogMessageDto,
    @Ctx() context: KafkaContext,
  ): Promise<ResponseDto> {
    try {
      await this.dialogService.createDialogMessage(from, to, text);
      return new ResponseDto(200, 'Ok');
    } catch (error) {
      return new ResponseDto(500, JSON.stringify(error));
    }
  }

  @MessagePattern('get_dialog_list')
  async getDialogList(
    @Payload() { from, to }: GetDialogListDto,
    @Ctx() context: KafkaContext,
  ): Promise<ResponseDto<IDialogMessage[]>> {
    try {
      const resultData = await this.dialogService.getDialogList(from, to);
      return new ResponseDto(200, 'Ok', resultData);
    } catch (error) {
      return new ResponseDto(500, JSON.stringify(error));
    }
  }
}
