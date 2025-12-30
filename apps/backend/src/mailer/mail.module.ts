
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.mail.ru',
                port: 465,
                secure: true, // Для портов 465 используйте secure: true
                auth: {
                    user: 'support@unilabs.studio',
                    pass: 'TEUdNkLjVYvsxk1RBVtJ', // Пароль приложения
                },
                tls: {
                    rejectUnauthorized: false, // Ignore self-signed certificate errors
                },
            },
            defaults: {
                from: '"No Reply" <support@unilabs.studio>'
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
