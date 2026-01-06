import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { FileModule } from './file/file.module';
import { ImageModule } from './image/image.module';
import { LayerModule } from './layers/layer.module';
import { MailModule } from './mailer/mail.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { SitesModule } from './sites/sites.module';
import { MetadataModule } from './metadata/metadata.module';
import { VariableModule } from './variable/variable.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { TilesModule } from './tiles/tiles.module';
import { PoolModule } from './pools/pools.module';

@Module({
  imports: [

    UserModule,
    MailModule,
    AuthModule,
    ImageModule,
    FileModule,
    LayerModule,
    DataModule,
    SitesModule,
    MetadataModule,
    VariableModule,
    TilesModule,
    PoolModule,

    TypeOrmModule.forRoot({

      logging: true,
      autoLoadEntities: true,
    }),
    CacheModule.register({ ttl: 30 * 60 * 1000, isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true, // делает env доступным во всех модулях
    }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
