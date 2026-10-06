import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/createUser.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserService } from '../user/user.service.js';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async signup(data: CreateUserDto){
        const hash = await bcrypt.hash(data.password, 10)

        const newData = {
            ...data,
            password : hash
        }
        return this.userService.createUser(newData)
    }

    async login(data: LoginDto){

        const user = await this.prisma.user.findUnique({
            where:{
                email: data.email
            }
        })
        if(!user){
            throw new UnauthorizedException('Invalid email or password')
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password)
        if(!passwordMatch){
            throw new UnauthorizedException('Invalid email or password')
        }

        const payload ={
            sub: user.id,
            email: user.email
        }

        const accessToken = await this.jwtService.sign(payload)

        return {accessToken, ...user}
    }


}
