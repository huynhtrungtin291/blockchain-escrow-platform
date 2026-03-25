import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Thêm Types
import { Transaction } from './schema/transaction.schema';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionsService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private escrowContract: ethers.Contract;

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private configService: ConfigService,
  ) {
    // 1. Cấu hình Provider
    const rpcUrl = this.configService.get<string>('BLOCKCHAIN_PROVIDER') || 'https://data-seed-prebsc-1-s1.binance.org:8545/';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // 2. Cấu hình Wallet (Admin)
    const privateKey = this.configService.get<string>('BLOCKCHAIN_WALLET');
    if (!privateKey) {
      throw new Error('BLOCKCHAIN_WALLET (Private Key) is missing in .env');
    }
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    // 3. Cấu hình Escrow Contract
    const contractAddress = this.configService.get<string>('BLOCKCHAIN_ESCROW_ADDRESS');
    if (!contractAddress) {
      throw new Error('BLOCKCHAIN_ESCROW_ADDRESS is missing in .env');
    }
    const abi = ['function releaseTrade(uint256 _tradeId) external', 'function refundTrade(uint256 _tradeId) external', 'function trades(uint256) view returns (address seller, address buyer, uint256 amount, bool isLocked, bool isCompleted)'];
    this.escrowContract = new ethers.Contract(contractAddress, abi, this.wallet);
  }

  // 1. Tạo đơn hàng DB
  async createOrder(buyerId: string, sellerId: string, amount: number, price: number, buyerWallet: string, sellerWallet: string) {
    return this.transactionModel.create({
      buyer_id: new Types.ObjectId(buyerId), // Sửa lỗi string -> ObjectId
      seller_id: new Types.ObjectId(sellerId), // Sửa lỗi string -> ObjectId
      amount_coin: amount,
      price_fiat: price,
      buyer_wallet_address: buyerWallet,
      seller_wallet_address: sellerWallet,
      status: 'pending',
    });
  }

  // 2. Seller báo đã nạp coin
  async confirmDeposit(transactionId: string, txHash: string, escrowTradeId: number) {
    return this.transactionModel.findByIdAndUpdate(
      transactionId,
      {
        status: 'locked',
        deposit_tx_hash: txHash,
        escrow_trade_id: escrowTradeId,
      },
      { new: true },
    );
  }

  // 3. Release Coin
  async releaseCoin(transactionId: string) {
    const tx = await this.transactionModel.findById(transactionId);
    if (!tx || tx.status !== 'locked') throw new Error('Transaction not valid for release');

    // Gọi Smart Contract
    const txResponse: any = await this.escrowContract.releaseTrade(tx.escrow_trade_id); // Thêm :any để bypass lỗi type check tạm thời
    await txResponse.wait();

    tx.status = 'completed';
    return tx.save();
  }
}
