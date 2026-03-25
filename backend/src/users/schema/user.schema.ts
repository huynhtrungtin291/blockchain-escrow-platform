import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop()
  nonce?: string;

  @Prop({ required: true, unique: true })
  wallet_address: string;

  @Prop()
  username?: string; // Tên hiển thị của người dùng trên giao diện

  @Prop()
  avatar?: string; // Link ảnh đại diện (URL)

  @Prop({ default: 0 })
  coin_balance?: number; // Số dư coin trong nội bộ hệ thống (nếu có dùng)

  // --- THÊM MỚI PHÂN QUYỀN ---
  // Quyền của tài khoản: 'user' (người dùng bình thường) hoặc 'admin' (quản trị viên)
  // Admin sẽ có quyền xem các giao dịch bị khiếu nại ('disputed') và xử lý
  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
