import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./models/user.entity";
import { ImageService } from "src/image/image.service";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private imageService: ImageService
    ) { }

    async findById(id: number) {
        return await this.userRepository.findOneBy({
            id: id
        });
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOneBy({
            email: email
        });
    }

    async save(user: User) {
        return await this.userRepository.save(user);
    }

    async delete(user: User) {

        if (user.image) {
            await this.imageService.delete(user.image);
        }

        return await this.userRepository.remove(user);
    }

} 