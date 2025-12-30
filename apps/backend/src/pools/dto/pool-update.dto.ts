
import { IsOptional, IsString, IsArray, IsNumber } from "@nestjs/class-validator";
import { FeatureCollection } from "geojson";

export class PoolUpdateDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    geojson?: FeatureCollection;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    siteIds?: number[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    tileIds?: string[];

}
