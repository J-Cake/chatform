import * as path from 'path';
import * as nm from 'nodemailer';
import * as ejs from 'ejs';
import * as socks from 'socks';

export enum Templates {
    passwordReset
}

type template = Record<Templates, string>;

export default class Email {
    static account: { user: string, pass: string } = {
        user: "jakieschneider13@gmail.com",
        pass: "JCake-DE03"
    };
    static transporter: nm.Transporter = nm.createTransport({
        // host: "smpt.jschneiderprojects.com.au",
        // @ts-ignore
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: Email.account,
        proxy: 'DIRECT'
    });
    static templates: template = {
        [Templates.passwordReset]: path.join(process.cwd(), '/views/emails/passwordReset.ejs')
    };
    template: Templates;
    subject: string;
    recipient: string;
    params: any;

    constructor(params: {
        subject: string,
        recipient: string,
        body: Templates,
        params: any
    }) {
        this.template = params.body;

        this.subject = params.subject;
        this.recipient = params.recipient;
        this.params = params.params;
    }

    async send(): Promise<nm.SentMessageInfo> {
        return await Email.transporter.sendMail({
            from: `"Password Recovery System" <jakieschneider13@gmail.com>`,
            to: this.recipient,
            subject: this.subject,
            html: await ejs.renderFile(Email.templates[this.template], {...this.params, domain: "localhost:9053"})
        });
    }
}

Email.transporter.set('proxy_socks_module', socks);