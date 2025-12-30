import { Pool } from 'src/pools/entities/pool.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('tiles')
export class Tile {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    geoPath: string;

    @Column()
    mbtilesPath: string;

    @Column({ nullable: true })
    type: 'geojson' | 'geotiff';

    @Column({ default: 'solid' })
    colorMode: 'solid' | 'gradient';

    @Column({ nullable: true })
    selectedVariable: string;

    @Column({ nullable: true })
    solidColor: string;

    @Column({ nullable: true })
    gradientColorA: string;

    @Column({ nullable: true })
    gradientColorB: string;

    @ManyToOne(() => Pool, pool => pool.tiles, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'pool_id' })
    pool: Pool | null;

}

