import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, sector, service_type, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Veuillez remplir les champs obligatoires.' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      subject: `[Yabila Global] ${subject}`,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
        <p><strong>Secteur :</strong> ${sector || 'Non renseigné'}</p>
        <p><strong>Service :</strong> ${service_type || 'Non renseigné'}</p>
        <p><strong>Objet :</strong> ${subject}</p>
        <p><strong>Message :</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Échec de l’envoi du message. Vérifiez la configuration SMTP.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
