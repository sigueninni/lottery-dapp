import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Address } from 'viem';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('check-status')
  async checkStatus() {
    return { result: await this.appService.checkStatus() }
  }

  @Post('open-lottery')
  async openLottery(@Body('time') time: string) {
    return { result: await this.appService.openLottery(time) }
  }

  @Post('close-lottery')
  async closeLottery() {
    return { result: await this.appService.closeLottery() }
  }

  @Post('purchase-tokens')
  async buyTokens(@Body('address') address: Address, @Body('amount') amount: string) {
    return { result: await this.appService.purchaseTokens(address, amount) }
  }

  @Get("token-balance")
  async tokenBalance(@Query('address') address: Address) {
    return { result: await this.appService.tokenBalance(address as `0x${string}`) }
  }

  @Post('bet')
  async bet(@Query('address') address: Address, @Query('amount') amount: number) {
    return { result: await this.appService.bet(amount, address as `0x${string}`) }
  }

  @Get('read-winner')
  async readWinner() {
    return { result: await this.appService.readWinner() }
  }
}