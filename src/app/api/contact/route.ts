import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validation basique
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires' },
        { status: 400 }
      );
    }

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email envoyé à la sophrologue
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'christinevallet.sophro@gmail.com',
      replyTo: email,
      subject: `Nouveau message de ${name} - Site Sophrologie`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #BFD8C0; border-bottom: 2px solid #BFD8C0; padding-bottom: 10px;">
            Nouveau message depuis le site
          </h2>
          
          <div style="background-color: #F6F1EB; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #BFD8C0;">
            <h3 style="margin-top: 0; color: #4A4A4A;">Message :</h3>
            <p style="white-space: pre-wrap; color: #6B6B6B;">${message}</p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Ce message a été envoyé depuis le formulaire de contact du site.
          </p>
        </div>
      `,
    };

    // Email de confirmation envoyé au client
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation de votre message - Christine Vallet Sophrologie',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #BFD8C0;">Merci pour votre message, ${name} !</h2>
          
          <p style="color: #4A4A4A; line-height: 1.6;">
            J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais, 
            généralement sous 24 heures.
          </p>
          
          <div style="background-color: #F6F1EB; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #4A4A4A; margin-top: 0;">Récapitulatif de votre message :</h3>
            <p style="white-space: pre-wrap; color: #6B6B6B;">${message}</p>
          </div>
          
          <p style="color: #4A4A4A; line-height: 1.6;">
            En attendant, n'hésitez pas à me contacter par téléphone si votre demande est urgente.
          </p>
          
          <p style="color: #4A4A4A;">
            À très bientôt,<br>
            <strong>Christine Vallet</strong><br>
            Sophrologue certifiée
          </p>
          
          <hr style="border: none; border-top: 1px solid #E8C7C8; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            📞 07 81 44 27 33<br>
            📍 42 rue du Général Nassoy, 57590 Delme 
          </p>
        </div>
      `,
    };

    // Envoi des emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      { message: 'Email envoyé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
