import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('update')
  updateProfile(@Request() req) {
    return this.usersService.update(req.user._id, req.body);
  }

  @Post('change-password')
  async changePassword(@Request() req) {
    const data: ChangePasswordDto = req.body as ChangePasswordDto;
    if (
      data.old &&
      (await this.usersService.validatePassword(req.user._id, data.old))
    ) {
      if (data.password && data.confirm && data.password === data.confirm) {
        return this.usersService.changePassword(req.user._id, data.password);
      } else {
        throw new HttpException('Passwords not match', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Old password not match', HttpStatus.BAD_REQUEST);
    }
  }
}
