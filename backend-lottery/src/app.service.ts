import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, http, formatUnits, createWalletClient, parseEther, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import * as lotteryJson from './assets/Lottery.json';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';
import { abi } from "./assets/Lottery.json";



const MAXUINT256 =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;

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


  async checkStatus(): Promise<boolean> {
    const status = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "betsOpen"
    });

    return status;
  }


  async readWinner() {
    const tx = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "prize",
      args: [""] //TODO
    })

    console.log(formatEther(tx))


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


  async openLottery(time: string) {
    const currentBlock = await this.publicClient.getBlock();
    const timeStamp = currentBlock?.timestamp ?? 0;
    const response = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "openBets",
      args: [timeStamp + BigInt(time)]
    })

    return response;
  }


  async closeLottery() {
    const response = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "closeLottery"
    })

    return response;
  }


  async purchaseTokens(address: Address, amount: string) {
    const response = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "purchaseTokens",
      from: address,
      value: parseEther(amount)
    })

    return response
  }


  async tokenBalance(address: `0x${string}`) {
    const tokenAddress = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "paymentToken",
    })

    const response = await this.publicClient.readContract({
      address: tokenAddress,
      abi: lotteryJson.abi,
      functionName: "balanceOf",
      args: [address]
    })

    return formatEther(response)
  }

  async approve(address: `0x${string}`) {
    const contractAddress = this.getContractAddress();

    const tokenAddress = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "paymentToken"
    })

    console.log("TokenAddress: ", tokenAddress)

    const allowTx = await this.walletClient.writeContract({
      address: tokenAddress,
      abi: lotteryJson.abi,
      functionName: "approve",
      args: [contractAddress, MAXUINT256],
      from: address
    })

    console.log("allowTX response: ", allowTx)

    const allowTxReceipt = await this.publicClient.waitForTransactionReceipt({ hash: allowTx })

    console.log("allowTxReceipt: ", allowTxReceipt)

    return allowTxReceipt;
  }

  async bet(amount: number, address: `0x${string}`) {
    // const testAmount = 1
    const contractAddress = this.getContractAddress();

    const tokenAddress = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "paymentToken"
    })

  }

}
