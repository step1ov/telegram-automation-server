import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RestorePasswordRequestDto } from './dto/restore-password-request.dto';
import otpGenerator from 'otp-generator';
import dayjs from 'dayjs';
import SendPasswordRestoreEmail from '../../utils/email/send-password-restore-email';
import { RestorePasswordValidateDto } from './dto/restore-password-validate.dto';
import { RestorePasswordResetDto } from './dto/restore-password-reset.dto';
import CryptoJS from 'crypto-js';
import * as process from 'process';
import { UserDocument } from './schemas/user.schema';

@Controller('password-restore')
export class PasswordRestoreController {
  constructor(private readonly usersService: UsersService) {}

  getOtp = () => {
    const code: string = otpGenerator.generate(20, { specialChars: false });
    const expiration = dayjs().add(30, 'minute').toDate();
    return { code, expiration };
  };

  @Post('req')
  async request(@Body() dto: RestorePasswordRequestDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) {
      user.otp = this.getOtp();
      const emailEncrypted = encodeURIComponent(
        CryptoJS.AES.encrypt(
          dto.email,
          process.env.EMAIL_ENCRYPT_SECRET_KEY.toString(),
        ).toString(),
      );
      await SendPasswordRestoreEmail(dto.email, emailEncrypted, user.otp.code);
      await user.save();
      return { ok: true };
    } else {
      throw new HttpException('Email not found', HttpStatus.BAD_REQUEST);
    }
  }

  async getValidatedUser(
    dto: RestorePasswordValidateDto,
  ): Promise<UserDocument> {
    if (dto.emailEncrypted) {
      const email = decodeURIComponent(
        CryptoJS.AES.decrypt(
          dto.emailEncrypted,
          process.env.EMAIL_ENCRYPT_SECRET_KEY,
        ).toString(CryptoJS.enc.Utf8),
      );
      const user = await this.usersService.findByEmailOTP(email);
      if (user) {
        if (user.otp) {
          if (user.otp.code === dto.otp) {
            if (user.otp.expiration > new Date()) {
              return user;
            } else {
              user.otp = undefined;
              await user.save();
              throw new HttpException(
                'Otp expired',
                HttpStatus.BAD_REQUEST + 4,
              );
            }
          } else {
            throw new HttpException(
              'Opt not match',
              HttpStatus.BAD_REQUEST + 3,
            );
          }
        } else {
          throw new HttpException('Opt not found', HttpStatus.BAD_REQUEST + 2);
        }
      } else {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST + 1);
      }
    } else {
      throw new HttpException(
        'String not provided',
        HttpStatus.BAD_REQUEST + 5,
      );
    }
  }

  @Post('validate')
  async validate(@Body() dto: RestorePasswordValidateDto) {
    await this.getValidatedUser(dto);
    return { ok: true };
  }

  @Post('reset')
  async reset(@Body() dto: RestorePasswordResetDto) {
    const user = await this.getValidatedUser(dto);
    if (dto.password && dto.confirm && dto.password === dto.confirm) {
      if (this.usersService.changePassword(user._id, dto.password)) {
        return { ok: true };
      } else {
        throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException(
        'Passwords not match',
        HttpStatus.BAD_REQUEST + 6,
      );
    }
  }
}
