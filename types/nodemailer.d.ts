declare module 'nodemailer' {
  interface TransportOptions {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string;
      pass?: string;
    };
  }

  interface MailOptions {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
  }

  interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<any>;
  }

  const nodemailer: {
    createTransport(options: TransportOptions): Transporter;
  };

  export default nodemailer;
}