import sendgrid from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const { SENDGRID_API } = process.env;
sendgrid.setApiKey(SENDGRID_API);
export const sendEmail = async (data) => {
  const email = { ...data, from: "chiernokur5@gmail.com" };
  await sendgrid.send(email);
  return true;
};

// async function main() {
//   try {
//     sendgrid.setApiKey(SENDGRID_API);
//     const email = {
//       from: "chiernokur5@gmail.com",
//       to: "xecike4321@rohoza.com",
//       subjekt: "",
//       html: "<p>Test email</p>",
//       text: "",
//     };
//     const respons = sendgrid.send(email);
//     console.log(respons);
//   } catch (error) {}
// }
// main();
