import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";
import nodemailer from "nodemailer";

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
});

// Connect with error handling
client.connect()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    return client.db("admin").command({ ping: 1 });
  })
  .then(() => console.log("✅ MongoDB ping successful"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // 👇 UPDATED SIGNATURE: Wrapped arguments in { }
    async sendResetPassword({ url, user }: { url: string; user: { email: string } }) {
      console.log("--------------------------------");
      console.log("DEBUG: Sending Reset Email");
      console.log("DEBUG: User Email:", user.email);
      console.log("DEBUG: URL:", url);
      console.log("--------------------------------");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      try {
        await transporter.sendMail({
          from: `"HirePilot Support" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: "Reset Your Password",
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Reset Your Password</h2>
              <p>Click the link below to reset your password:</p>
              <a href="${url}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </div>
          `,
        });
        console.log("✅ Email sent successfully");
      } catch (error) {
        console.error("❌ Email Error:", error);
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
