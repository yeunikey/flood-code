import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileModule } from "src/file/file.module";
import { Pool } from "./entities/pool.entity";
import { PoolService } from "./pool.service";
import { PoolController } from "./pool.controller";
import { Tile } from "src/tiles/entities/tile.entity";
import { Site } from "src/sites/entities/site";

@Module({
    imports: [
        TypeOrmModule.forFeature([Pool, Tile, Site]),
        FileModule
    ],
    providers: [PoolService],
    controllers: [PoolController],
    exports: [PoolService]
})
export class PoolModule { }