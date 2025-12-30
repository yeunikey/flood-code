import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, ConfirmDto, LoginDto, ChangePasswordDto, ChangeMailDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/users/user.service';
import { AuthRequest } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mailer/mail.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Request() req: AuthRequest) {
        const user = await this.userService.findById(req.user.id);
        return {
            statusCode: 200,
            data: {
                ...user,
                password: undefined 
            },
        };
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {

        const contains = await this.userService.findByEmail(body.user.email);

        if (contains) {
            return {
                statusCode: 400,
                message: "Такой юзер уже существует"
            };
        }

        const code = this.authService.generateCode();
        const timeout = setTimeout(() => {
            this.authService.codeMap.delete(body.user.email);
        }, 3 * 60 * 1000); // 3 минуты

        this.authService.codeMap.set(body.user.email, { code: code, user: body.user, timeout: timeout });

        await this.mailService.sendEmail(body.user.email, body.user.email, code)

        return {
            statusCode: 200,
        };
    }

    @Post('confirm')
    async confirm(@Body() { code, email }: ConfirmDto) {
        const contains = await this.userService.findByEmail(email);

        if (contains) {
            return {
                statusCode: 400,
                message: "Такой юзер уже существует"
            };
        }

        const codeRequest = this.authService.codeMap.get(email);

        if (!codeRequest) {
            return {
                statusCode: 400,
                message: "Нет заявки с кодом"
            };
        }

        if (codeRequest.code != code) {
            return {
                statusCode: 400,
                message: "Неправильный код"
            };
        }

        const password = await bcrypt.hash(codeRequest.user.password, 10);
        const user = await this.userService.save({
            ...codeRequest.user,
            password: password,
        });

        this.authService.codeMap.delete(email);

        const payload = {
            id: user.id,
        };

        return {
            statusCode: 200,
            data: {
                token: await this.jwtService.signAsync(payload),
                user: user
            }
        };
    }

    @Post('login')
    async login(@Body() { email, password }: LoginDto) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого юзера не существует"
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                statusCode: 400,
                message: "Неправильный пароль"
            };
        }

        const payload = {
            id: user.id,
        };

        return {
            statusCode: 200,
            data: {
                token: await this.jwtService.signAsync(payload),
                user: user
            }
        };
    }

    @UseGuards(AuthGuard)
    @Post('change-password')
    async changePassword(@Req() { user: { id } }: AuthRequest, @Body() body: ChangePasswordDto) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            }
        }

        if (body.newPassword != body.repeatPassword) {
            return {
                statusCode: 400,
                message: "Пароли не совпадают"
            }
        }

        const isMatch = await bcrypt.compare(body.oldPassword, user.password);

        if (!isMatch) {
            return {
                statusCode: 400,
                message: "Неправильный пароль"
            };
        }

        const password = await bcrypt.hash(body.newPassword, 10);
        user.password = password;

        await this.userService.save(user);

        return {
            statusCode: 200
        }
    }

    @UseGuards(AuthGuard)
    @Post('/change-mail')
    async changeMail(@Req() { user: { id } }: AuthRequest, @Body() body: ChangeMailDto) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого пользователя не существует"
            }
        }

        const contains = await this.userService.findByEmail(body.newMail);

        if (contains) {
            return {
                statusCode: 400,
                message: "Пользователь с такой email уже существует"
            }
        }

        const code = this.authService.generateCode();
        const timeout = setTimeout(() => {
            this.authService.mailMap.delete(body.newMail);
        }, 3 * 60 * 1000); // 3 минуты

        this.authService.mailMap.set(body.newMail, { code: code, timeout: timeout });

        await this.mailService.sendEmail(body.newMail, user.email, code);

        return {
            statusCode: 200,
        };
    }

    @UseGuards(AuthGuard)
    @Post('/confirm-mail')
    async confirmMail(@Req() { user: { id } }: AuthRequest, @Body() { email, code }: ConfirmDto) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого пользователя не существует"
            }
        }

        const contains = await this.userService.findByEmail(email);

        if (contains) {
            return {
                statusCode: 400,
                message: "Такого пользователя уже существует"
            };
        }

        const codeRequest = this.authService.mailMap.get(email);

        if (!codeRequest) {
            return {
                statusCode: 400,
                message: "Нет заявки с кодом"
            };
        }

        if (codeRequest.code != code) {
            return {
                statusCode: 400,
                message: "Неправильный код"
            };
        }

        const saved = await this.userService.save({
            ...user,
            email: email
        });

        this.authService.mailMap.delete(email);

        return {
            statusCode: 200,
            data: saved
        };
    }

}
