import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(email: string, name: string, code: number): Promise<void> {

        try {
            await this.mailerService.sendMail({
                to: email,
                from: "support@unilabs.studio",
                subject: 'Подтверждение аккаунта',
                template: 'index',
                context: {
                    userName: name,
                    code: code
                },
            });

            console.log('Email sent successfully to ' + email);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
