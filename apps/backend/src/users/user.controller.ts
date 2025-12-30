import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthRequest } from "src/types";
import { ImageService } from "src/image/image.service";
import { UserUpdateDto } from "./dto/user.dto";

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private imageService: ImageService,
    ) { }

    @Get('get/:id')
    async get(@Param() params: { id: number }) {

        const user = await this.userService.findById(params.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такой пользователь не найден"
            };
        }

        return {
            statusCode: 200,
            data: {
                ...user,
                password: undefined
            }
        }
    }

    @Post('delete')
    @UseGuards(AuthGuard)
    async delete(@Req() req: AuthRequest) {

        const user = await this.userService.findById(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        await this.userService.delete(user);

        return {
            statusCode: 200
        }
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Req() req: AuthRequest, @Body() body: UserUpdateDto) {
        const user = await this.userService.findById(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        if (body.image) {
            if (user.image) {
                await this.imageService.delete(user.image);
            }
            user.image = body.image;
        }

        const saved = await this.userService.save(user);

        return {
            statusCode: 200,
            message: 'Профиль обновлён',
            data: {
                ...saved,
                password: undefined
            }
        };
    }

}