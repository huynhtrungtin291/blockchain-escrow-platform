import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

enum TransactionStatus {
  PENDING = 'pending', // Vừa tạo lệnh
  DEPOSITED = 'deposited', // Seller đã nạp coin vào két
  PAID = 'paid', // Buyer báo đã chuyển khoản VND
  COMPLETED = 'completed', // Đã giải ngân coin thành công cho Buyer
  DISPUTED = 'disputed', // Một trong hai bên khiếu nại (Cần Admin can thiệp)
  CANCELLED = 'cancelled', // Giao dịch bị hủy (Hoàn coin nếu đã nạp)
}
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyer_id: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller_id: User | Types.ObjectId;

  @Prop({ required: true })
  buyer_wallet_address: string;

  @Prop({ required: true })
  seller_wallet_address: string;

  @Prop({ required: true })
  amount_coin: number;

  @Prop({ required: true })
  price_fiat: number; // Giá tiền mặt quy đổi (VND)

  //THÔNG TIN SMART CONTRACT
  @Prop()
  escrow_trade_id: number; // ID giao dịch trên Blockchain để gọi hàm release/cancel

  @Prop()
  deposit_tx_hash: string; // Hash khi Seller nạp coin vào két (Bằng chứng đã nạp)

  @Prop()
  release_tx_hash: string; // Hash khi hệ thống tự động/Admin giải ngân coin cho Buyer

  @Prop()
  refund_tx_hash: string; // Hash khi Admin hủy giao dịch, hoàn coin cho Seller

  // THÔNG TIN THANH TOÁN & TRANH CHẤP
  @Prop()
  payment_proof: string; // Link URL ảnh chụp bill chuyển khoản của Buyer

  @Prop()
  admin_note: string; // Lời phê/Ghi chú của Admin khi xử lý khiếu nại

  @Prop({ default: TransactionStatus.PENDING })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
