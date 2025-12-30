import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/models/user.entity";
import { DeepPartial, Repository } from "typeorm";
import { Layer } from "./entities/layer.entity";
import { FileService } from "src/file/file.service";

@Injectable()
export class LayerService {

    constructor(
        @InjectRepository(Layer)
        private layerRepository: Repository<Layer>,
        private fileService: FileService
    ) { }

    async findAllByUser(user: User) {
        return await this.layerRepository.find({
            where: { user },
        });
    }

    async findById(id: number) {
        return await this.layerRepository.findOne({
            where: { id },
        });
    }

    async save(layer: DeepPartial<Layer>) {
        return await this.layerRepository.save(layer);
    }

    async delete(layer: Layer) {
        await this.fileService.delete(layer.file);
        return await this.layerRepository.remove(layer);
    }

}
