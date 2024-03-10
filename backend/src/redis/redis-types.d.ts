import 'ioredis';

declare module 'ioredis' {
  interface Redis {
    sendMessageToDialog(from: string, to: string, text: string): Promise<string>;
    getMessagesFromDialog(from: string, to: string): Promise<string[]>;
    // Добавление других методов по мере необходимости
  }
}
