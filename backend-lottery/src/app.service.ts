import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, http, formatUnits, createWalletClient, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import * as lotteryJson from './assets/Lottery.json';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  publicClient;
  walletClient;
  account;

  constructor(private configService: ConfigService) {

    const deployerPrivateKey = this.configService.get<string>('PRIVATE_KEY');

    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
    });

    this.account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    this.walletClient = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): Address {
    return this.configService.get<Address>('LOTTERY_ADDRESS');
  }


  async checkBetsOpen() {
    const betsOpen = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: lotteryJson.abi,
      functionName: "betsOpen"
    });

    console.log({ betsOpen });
    return betsOpen ?
      `Best open`
      : `Bets closed`
  }

}
