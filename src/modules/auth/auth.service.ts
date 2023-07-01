import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    return this.usersService.validateUser(username, password);
  }
  async login(user: UserDocument) {
    const payload = { userId: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
