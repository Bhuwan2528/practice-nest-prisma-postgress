import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){}

    async createUser(data: CreateUserDto) {
        const user = await this.prisma.user.findUnique({
            where:{
                email: data.email
            }
        })

        if(user){
            throw new ConflictException("User already exists");
        }
        else{
            return this.prisma.user.create({ data });
        }
    }
}
