import { Body, Controller, Get, HttpStatus, Post, Query, Req, UseGuards } from "@nestjs/common";
import { LayerService } from "./layer.service";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthRequest } from "src/types";
import { LayerCreateDto } from "./dto/layer-create.dto";
import { UserService } from "src/users/user.service";
import { DeepPartial } from "typeorm";
import { Layer } from "./entities/layer.entity";

@Controller('layers')
export class LayerController {

    constructor(
        private layerService: LayerService,
        private userService: UserService
    ) { }

    @Get('my')
    @UseGuards(AuthGuard)
    async getMyLayers(@Req() { user: { id } }: AuthRequest) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого пользователя не существует"
            }
        }

        const layers = await this.layerService.findAllByUser(user);

        return {
            statusCode: 200,
            data: layers
        };
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Req() { user: { id } }: AuthRequest, @Body() body: LayerCreateDto) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого пользователя не существует"
            }
        }

        const obj: DeepPartial<Layer> = {
            name: body.name,
            file: body.file,
            user: user
        }

        const saved = await this.layerService.save(obj);

        return {
            statusCode: 201,
            message: "Слой успешно создан",
            data: saved
        };
    }

    @Get('delete')
    @UseGuards(AuthGuard)
    async delete(@Req() { user: { id } }: AuthRequest, @Query('layer_id') layer_id: LayerCreateDto) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого пользователя не существует"
            }
        }

        const layer = await this.layerService.findById(Number(layer_id));

        if (!layer) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Такого слоя больше не существует'
            }
        }

        await this.layerService.delete(layer);

        return {
            statusCode: 200
        }
    }

}
