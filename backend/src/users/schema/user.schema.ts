import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

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
  coin_balance?: number; // Số dư coin hiện tại của người dùng

  @Prop({ default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
