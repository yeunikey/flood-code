
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Pool } from "./entities/pool.entity";
import { Site } from "src/sites/entities/site";
import { FeatureCollection } from "geojson";
import { Tile } from "src/tiles/entities/tile.entity";

@Injectable()
export class PoolService {

    constructor(
        @InjectRepository(Pool)
        private poolRepository: Repository<Pool>,

        @InjectRepository(Site)
        private siteRepository: Repository<Site>,

        @InjectRepository(Tile)
        private tileRepository: Repository<Tile>,
    ) { }

    async findAll() {
        return this.poolRepository.find({
            relations: ['sites', 'tiles'],
        });
    }

    async findById(id: number) {
        return this.poolRepository.findOne({
            where: { id },
            relations: ['sites', 'tiles'],
        });
    }

    async create(
        name: string,
        geojson: FeatureCollection,
        siteIds: number[],
        tileIds: string[]
    ) {
        const pool = await this.poolRepository.save({
            name,
            geojson
        });

        if (siteIds?.length) {
            await this.siteRepository.update(
                { id: In(siteIds) },
                { pool }
            );
        }

        console.log(tileIds)

        if (tileIds?.length) {
            await this.tileRepository.update(
                { id: In(tileIds) },
                { pool: { id: pool.id } }
            );
        }

        return this.findById(pool.id);
    }

    async update(
        pool: Pool,
        name?: string,
        geojson?: FeatureCollection,
        siteIds?: number[],
        tileIds?: string[]
    ) {

        if (name !== undefined) pool.name = name;
        if (geojson !== undefined) pool.geojson = geojson;

        await this.poolRepository.save(pool);

        if (siteIds) {
            await this.siteRepository.update(
                { pool: { id: pool.id } },
                { pool: null }
            );

            if (siteIds.length) {
                await this.siteRepository.update(
                    { id: In(siteIds) },
                    { pool }
                );
            }
        }

        if (tileIds) {
            await this.tileRepository.update(
                { pool: { id: pool.id } },
                { pool: null }
            );

            if (tileIds.length) {
                await this.tileRepository.update(
                    { id: In(tileIds) },
                    { pool: { id: pool.id } }
                );
            }
        }

        return this.findById(pool.id);
    }

    async delete(pool: Pool) {
        await this.siteRepository.update(
            { pool: { id: pool.id } },
            { pool: null }
        );

        return this.poolRepository.remove(pool);
    }
}
