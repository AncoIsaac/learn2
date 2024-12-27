import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { LoginPersonDto } from './dto/loginPerson.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiCreatedResponse({ description: 'Successfully' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('loginPerson')
  @ApiOperation({ summary: 'Login person' })
  @ApiCreatedResponse({ description: 'Successfully' })
  async loginPerson(@Body() loginPersonDto: LoginPersonDto) {
    const person = await this.authService.validatePerson(loginPersonDto.name);
    if (!person) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.loginPerson(person);
  }
}
