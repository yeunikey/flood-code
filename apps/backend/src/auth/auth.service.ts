
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/models/user.entity';

@Injectable()
export class AuthService {

    codeMap = new Map<string, { code: number; user: User; timeout: NodeJS.Timeout }>();
    mailMap = new Map<string, { code: number; timeout: NodeJS.Timeout }>();

    generateCode() {
        return Math.floor(1000 + Math.random() * 9000);
    }

}
