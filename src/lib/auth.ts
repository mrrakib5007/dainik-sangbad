import { betterAuth } from "better-auth";
import { MongoClient, type Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const connectionString = process.env.BETTER_AUTH_DB_URL;

if (!connectionString) {
  throw new Error("BETTER_AUTH_DB_URL environment variable is not defined");
}

const client = new MongoClient(connectionString);
const db: Db = client.db("dainik_sangbad_db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
        google: { 
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET as string, 
        },
    },
});