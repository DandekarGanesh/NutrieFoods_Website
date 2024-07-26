const nodemailer = require('nodemailer');


async function sendMail(email, subject, message) {
    
//   let transporter =
//     nodemailer.createTransport(
//         {
//             service: 'gmail',
//             auth: {
//                 user: 'ggaanneesshhhh80@gmail.com',
//                 pass: process.env.EMAIL_PASS
//             }
//         }
//     );



//      let info = await transporter.sendMail({
//           from: "Nutrie Foods", // sender address
//           to: email, // list of receivers
//           subject: subject, // Subject line
//           html: `<a href=${message}> Click here </a> to Change the password at Nutrie foods`
//      });



//      transporter
//     .sendMail(info,
//         function (err, data) {
//             if (err) {
//                 console.log('Error Occurs');
//             } else {
//                 console.log('Email sent successfully');
//             }
//         });

     
     console.log("Link to change password :"+message);
}


module.exports = sendMail;