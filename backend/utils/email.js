import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Configuration du transporteur email
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'smtp') {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else {
    return nodemailer.createTransporter({
      service: emailService,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

// Templates d'emails
const emailTemplates = {
  welcome: {
    subject: 'Bienvenue chez MIREB !',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Bienvenue chez MIREB !</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333;">Bonjour {{nom}} {{prenom}},</h2>
          <p style="color: #666; line-height: 1.6;">
            Nous sommes ravis de vous accueillir dans la communauté MIREB ! 
            Votre compte a été créé avec succès.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Vous pouvez maintenant accéder à tous nos services et découvrir 
            nos solutions innovantes pour votre entreprise.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{loginUrl}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Accéder à mon compte
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Si vous avez des questions, n'hésitez pas à nous contacter à 
            <a href="mailto:support@mireb.com">support@mireb.com</a>
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2024 MIREB. Tous droits réservés.</p>
        </div>
      </div>
    `
  },

  resetPassword: {
    subject: 'Réinitialisation de votre mot de passe MIREB',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Réinitialisation de mot de passe</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333;">Bonjour {{nom}} {{prenom}},</h2>
          <p style="color: #666; line-height: 1.6;">
            Vous avez demandé la réinitialisation de votre mot de passe pour votre compte MIREB.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetUrl}}" style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, 
            ignorez simplement cet email.
          </p>
          <p style="color: #666; font-size: 14px;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            <br><a href="{{resetUrl}}">{{resetUrl}}</a>
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2024 MIREB. Tous droits réservés.</p>
        </div>
      </div>
    `
  },

  newLead: {
    subject: 'Nouveau lead reçu - {{nom}} {{prenom}}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nouveau Lead 🎯</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333;">Nouveau prospect intéressé !</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Informations du contact :</h3>
            <p><strong>Nom :</strong> {{nom}} {{prenom}}</p>
            <p><strong>Email :</strong> {{email}}</p>
            <p><strong>Téléphone :</strong> {{telephone}}</p>
            <p><strong>Entreprise :</strong> {{entreprise}}</p>
            <p><strong>Source :</strong> {{source}}</p>
            <p><strong>Budget estimé :</strong> {{budget}}€</p>
          </div>
          {{#if message}}
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">Message :</h4>
            <p style="color: #333; font-style: italic;">"{{message}}"</p>
          </div>
          {{/if}}
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{crmUrl}}/leads/{{leadId}}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Voir dans le CRM
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2024 MIREB. Tous droits réservés.</p>
        </div>
      </div>
    `
  },

  leadStatusChange: {
    subject: 'Changement de statut du lead - {{nom}} {{prenom}}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mise à jour Lead 📊</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333;">Le statut d'un lead a changé</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Lead :</strong> {{nom}} {{prenom}}</p>
            <p><strong>Email :</strong> {{email}}</p>
            <p><strong>Ancien statut :</strong> <span style="color: #6c757d;">{{ancienStatut}}</span></p>
            <p><strong>Nouveau statut :</strong> <span style="color: #ffc107; font-weight: bold;">{{nouveauStatut}}</span></p>
            <p><strong>Date de changement :</strong> {{dateChangement}}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{crmUrl}}/leads/{{leadId}}" style="background: #ffc107; color: #333; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Voir les détails
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2024 MIREB. Tous droits réservés.</p>
        </div>
      </div>
    `
  },

  contactForm: {
    subject: 'Nouveau message de contact - {{nom}} {{prenom}}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nouveau Message 📧</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333;">Nouveau message via le formulaire de contact</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #6f42c1; margin-top: 0;">Informations du contact :</h3>
            <p><strong>Nom :</strong> {{nom}} {{prenom}}</p>
            <p><strong>Email :</strong> {{email}}</p>
            <p><strong>Téléphone :</strong> {{telephone}}</p>
            <p><strong>Sujet :</strong> {{sujet}}</p>
          </div>
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #6f42c1; margin-top: 0;">Message :</h4>
            <p style="color: #333; line-height: 1.6;">{{message}}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:{{email}}?subject=Re: {{sujet}}" style="background: #6f42c1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Répondre par email
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2024 MIREB. Tous droits réservés.</p>
        </div>
      </div>
    `
  }
};

// Fonction pour remplacer les variables dans un template
const replaceTemplateVariables = (template, variables) => {
  let result = template;
  
  // Remplacer les variables simples {{variable}}
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  }
  
  // Gérer les conditions {{#if variable}}...{{/if}}
  result = result.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, variable, content) => {
    return variables[variable] ? content : '';
  });
  
  return result;
};

// Fonction principale d'envoi d'email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const {
      to,
      subject,
      template: templateName,
      variables = {},
      attachments = []
    } = options;

    let emailContent;
    let emailSubject = subject;

    // Utiliser un template prédéfini si spécifié
    if (templateName && emailTemplates[templateName]) {
      const template = emailTemplates[templateName];
      emailContent = replaceTemplateVariables(template.template, variables);
      emailSubject = replaceTemplateVariables(template.subject, variables);
    } else {
      emailContent = options.html || options.text || '';
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'MIREB'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: emailSubject,
      html: emailContent,
      attachments
    };

    // Ajouter une version texte si seulement HTML est fourni
    if (emailContent && !options.text) {
      mailOptions.text = emailContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email envoyé avec succès:', {
      messageId: result.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };

  } catch (error) {
    console.error('Erreur envoi email:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Fonctions spécialisées pour chaque type d'email
export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    template: 'welcome',
    variables: {
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
    }
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  return sendEmail({
    to: user.email,
    template: 'resetPassword',
    variables: {
      nom: user.nom,
      prenom: user.prenom,
      resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    }
  });
};

export const sendNewLeadNotification = async (lead, adminEmails) => {
  return sendEmail({
    to: adminEmails,
    template: 'newLead',
    variables: {
      nom: lead.nom,
      prenom: lead.prenom,
      email: lead.email,
      telephone: lead.telephone || 'Non renseigné',
      entreprise: lead.entreprise || 'Non renseignée',
      source: lead.source,
      budget: lead.budget || 'Non spécifié',
      message: lead.message,
      leadId: lead._id,
      crmUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    }
  });
};

export const sendLeadStatusChangeNotification = async (lead, oldStatus, newStatus, adminEmails) => {
  return sendEmail({
    to: adminEmails,
    template: 'leadStatusChange',
    variables: {
      nom: lead.nom,
      prenom: lead.prenom,
      email: lead.email,
      ancienStatut: oldStatus,
      nouveauStatut: newStatus,
      dateChangement: new Date().toLocaleDateString('fr-FR'),
      leadId: lead._id,
      crmUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    }
  });
};

export const sendContactFormEmail = async (contactData, adminEmails) => {
  return sendEmail({
    to: adminEmails,
    template: 'contactForm',
    variables: {
      nom: contactData.nom,
      prenom: contactData.prenom,
      email: contactData.email,
      telephone: contactData.telephone || 'Non renseigné',
      sujet: contactData.sujet,
      message: contactData.message
    }
  });
};

// Fonction pour envoyer un email personnalisé
export const sendCustomEmail = async (to, subject, content, variables = {}) => {
  const htmlContent = replaceTemplateVariables(content, variables);
  
  return sendEmail({
    to,
    subject: replaceTemplateVariables(subject, variables),
    html: htmlContent
  });
};

// Fonction pour envoyer un email avec pièces jointes
export const sendEmailWithAttachments = async (options) => {
  const { attachments = [], ...emailOptions } = options;
  
  // Traiter les pièces jointes
  const processedAttachments = attachments.map(attachment => {
    if (typeof attachment === 'string') {
      // Si c'est un chemin de fichier
      return {
        filename: path.basename(attachment),
        path: attachment
      };
    } else if (attachment.buffer) {
      // Si c'est un buffer
      return {
        filename: attachment.filename || 'attachment',
        content: attachment.buffer,
        contentType: attachment.contentType
      };
    } else {
      // Configuration d'attachment complète
      return attachment;
    }
  });

  return sendEmail({
    ...emailOptions,
    attachments: processedAttachments
  });
};

// Fonction pour valider la configuration email
export const validateEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    console.log('Configuration email validée avec succès');
    return { success: true };
  } catch (error) {
    console.error('Erreur configuration email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Fonction pour obtenir les statistiques d'envoi
export const getEmailStats = () => {
  // Dans une vraie application, vous pourriez stocker ces stats en base
  return {
    emailsSent: 0,
    emailsFailed: 0,
    lastEmailSent: null,
    configurationValid: false
  };
};
