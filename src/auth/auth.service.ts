import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { notAcceptable, unauthorized } from 'src/common/errors';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dt';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.userService.createAdminUser();
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) unauthorized();
    if (!PasswordUtils.comparePassword(password, user.password)) unauthorized();

    const secret = this.config.get('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync({ user }, { secret });
    return {
      user: user,
      accessToken,
    };
  }

  async changePassword(data: ChangePasswordDto) {
    if (data.newPassword !== data.newPasswordAgain)
      notAcceptable('Passwords are not same');
    const user = await this.userService.getUserById(data.userId);
    if (!user) unauthorized();
    if (!PasswordUtils.comparePassword(data.password, user.password))
      unauthorized('Wrong password');

    user.password = PasswordUtils.createHashedPassword(data.newPassword);
    await user.save();

    return {
      message: 'Password updated',
    };
  }
}
