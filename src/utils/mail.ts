import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options: any) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "TheChatterBox",
            link: "https://localhost:8080"

        },
    })



    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

    const emailHtml = mailGenerator.generate(options.mailgenContent);

    // Ceck if the process.env variables are defined 
    
    if (!process.env.MAILTRAP_SMTP_HOST || !process.env.MAILTRAP_SMTP_PORT || !process.env.MAILTRAP_SMTP_USER || !process.env.MAILTRAP_SMTP_PASS) {
    throw new Error("Required environment variables are not defined.");
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT),
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },

    });
    const mail = {
        from: "TheChatterBox.official@gmail.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html:emailHtml,
    }

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        
        console.log(
            "email service failed silently. Check MailTrap credentials in the .env file"
        );
        console.log("error: ", error)
    }

}

//lets design the email 

const emailVerificationMailgenContent = (username: string, verficationUrl: string) => {
    return {
        body: {
            name: username,
            intro: "welcome to our ChatterBox!! we are very excited to have you on board.",
            action: {
                instructions: 
                    "To verify your email please click on the following button:",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verficationUrl,
                },
                
            },
            outro:"For further querries and questions reply to the email, we'd love to help"

            
        }
    }
}

const forgotPasswordMailgenContent = (username:String, passwordResetUrl:String) =>{
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
}