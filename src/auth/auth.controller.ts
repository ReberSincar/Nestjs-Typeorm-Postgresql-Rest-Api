import { Body, Controller, Post, Put, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Put('password')
  changePassword(@Body() body: ChangePasswordDto, @Request() req: any) {
    body.userId = req.user.id;
    return this.authService.changePassword(body);
  }
}
