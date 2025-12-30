import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LayerService } from "./layer.service";
import { LayerController } from "./layer.controller";
import { Layer } from "./entities/layer.entity";
import { UserModule } from "src/users/user.module";
import { FileModule } from "src/file/file.module";

@Module({
    imports: [TypeOrmModule.forFeature([Layer]), UserModule, FileModule],
    providers: [LayerService],
    controllers: [LayerController],
    exports: [LayerService]
})
export class LayerModule { }
