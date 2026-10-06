import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserService } from '../user/user.service.js';
import { CreateUserDto } from '../user/dto/createUser.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    @Post('signup')
    signup(@Body() data: CreateUserDto) {
        return this.authService.signup(data)
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() data: LoginDto){
        return this.authService.login(data)
    }
}
