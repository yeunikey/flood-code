import { FeatureCollection } from "geojson";
import { Site } from "src/sites/entities/site";
import { Tile } from "src/tiles/entities/tile.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('pools')
export class Pool {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'jsonb',
        nullable: false,
    })
    geojson: FeatureCollection;

    @OneToMany(() => Site, site => site.pool)
    sites: Site[];

    @OneToMany(() => Tile, tile => tile.pool)
    tiles: Tile[];

}
