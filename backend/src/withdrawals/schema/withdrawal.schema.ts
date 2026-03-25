import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type WithdrawalDocument = HydratedDocument<Withdrawal>;

enum WithdrawalStatus {
  PENDING = 'pending', // Chờ duyệt
  APPROVED = 'approved', // Đã chuyển tiền
  REJECTED = 'rejected', // Từ chối
}
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Withdrawal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: User | Types.ObjectId;

  @Prop({ required: true })
  coin_amount: number;

  @Prop({ required: true })
  amount_vnd: number;

  @Prop({ required: true })
  bank_account: string; // BỔ SUNG: Thông tin NH (VD: "Vietcombank - 0123456789 - NGUYEN GIA HUYEN")

  @Prop()
  admin_note?: string; // BỔ SUNG: Ghi chú của Admin (VD: "Sai số tài khoản", "Đã duyệt")

  @Prop({ default: WithdrawalStatus.PENDING })
  status: WithdrawalStatus;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);
