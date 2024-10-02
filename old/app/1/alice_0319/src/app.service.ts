import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: "オブジェクトはJSONに変換される",
      date: new Date()
    }
  }
}
