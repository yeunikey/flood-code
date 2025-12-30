import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/user.entity";
import { UserController } from "./user.controller";
import { ImageModule } from "src/image/image.module";

@Module({
    providers: [
        UserService,
    ],
    controllers: [
        UserController,
    ],

    imports: [
        TypeOrmModule.forFeature([User]),
        ImageModule,
    ],
    exports: [
        UserService
    ]
})
export class UserModule { }