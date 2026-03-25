import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Public } from 'src/users/public.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // 1. Tạo lệnh mua bán
  @Public()
  @Post('create')
  create(@Body() body: any) {
    return this.transactionsService.createOrder(body.buyerId, body.sellerId, body.amount, body.price, body.buyerWallet, body.sellerWallet);
  }

  // 2. Xác nhận Seller đã nạp Coin (Frontend gửi txHash lên)
  @Public()
  @Put('confirm-deposit/:id')
  confirmDeposit(@Param('id') id: string, @Body() body: any) {
    return this.transactionsService.confirmDeposit(id, body.txHash, body.escrowTradeId);
  }

  // 3. Admin release Coin
  @Public()
  @Post('release/:id')
  release(@Param('id') id: string) {
    return this.transactionsService.releaseCoin(id);
  }
}
