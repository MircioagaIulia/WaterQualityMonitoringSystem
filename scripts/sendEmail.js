import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

let user = null;  


onAuthStateChanged(auth, (currentUser) => {
  user = currentUser;  
  if (user) {
    console.log("The user is authentificated:", user.email);
  } else {
    console.log("There is no user authentificated");
  }
});


const sendEmail = async (subject, body) => {
  if (user) {
    const userEmail = user.email;  
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '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'
        },
        body: JSON.stringify({
          sender: { name: 'Water quality monitoring system', email: 'wqmonitoringsystem@gmail.com' },
          to: [{ email: userEmail, name: userEmail }], 
          subject: subject,
          textContent: body
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`API Error: ${data.message || response.statusText}`);
      }
      console.log('Email successfuly sent:', data);

    } catch (error) {
      console.error('Error sending email:', error);
    }
  } else {
    console.log("There are no logged in users");
  }
};

export { sendEmail };
