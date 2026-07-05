Pour utiliser EmailJS sur ce formulaire :

1. Créez un compte sur https://www.emailjs.com/
2. Ajoutez un service email (Gmail, Outlook, etc.)
3. Créez un template email
4. Récupérez :
   - votre Public Key
   - votre Service ID
   - votre Template ID
5. Remplacez les valeurs suivantes dans main.js :
   - YOUR_PUBLIC_KEY
   - YOUR_SERVICE_ID
   - YOUR_TEMPLATE_ID

Le template EmailJS doit contenir ces variables :
- {{name}}
- {{email}}
- {{phone}}
- {{sector}}
- {{service_type}}
- {{subject}}
- {{message}}
