import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyer_id: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller_id: User | Types.ObjectId;

  // Địa chỉ ví blockchain thực tế
  @Prop({ required: true })
  buyer_wallet_address: string;

  @Prop({ required: true })
  seller_wallet_address: string;

  @Prop({ required: true })
  amount_coin: number;

  @Prop({ required: true })
  price_fiat: number; // Giá tiền quy đổi do web quy định

  // ID của trade trên Smart Contract
  @Prop()
  escrow_trade_id: number;

  // Transaction Hash lúc Seller nạp coin vào escrow
  @Prop()
  deposit_tx_hash: string;

  @Prop({ default: 'pending' }) // pending, locked, released, cancelled
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
