# Comprehensive Guide to Implementing NextAuth v5 in a Next.js Project

This guide provides step-by-step instructions for integrating NextAuth v5 into your Next.js application, utilizing tools like Shadcn UI components, React Icons, and Prisma ORM with PostgreSQL. The goal is to create a user-friendly authentication system with email/password credentials and social login options.

## Prerequisites

Ensure you have the following installed:

- Node.js (v18.7.x recommended)
- npm or yarn
- PostgreSQL database

## Project Setup

1. **Initialize a New Next.js Project**

   ```bash
   npx create-next-app@latest my-app -d
   cd my-app

   	2.	Add Shadcn UI Components
   Initialize Shadcn UI in your project:
   ```

npx shadcn-ui@latest init

Install the required components:

npx shadcn-ui@latest add button card input form

    3.	Install React Icons

npm install react-icons

Authentication Pages Structure

Create an auth directory with a login page:
• Login Page:
• Wraps content in a Card component from Shadcn.
• Accepts props: headerLabel, backButtonLabel, backButtonHref, and showSocial.
• Includes:
• Custom header in Card header.
• children in Card content for the login form.
• Social icons and back button in Card footer.

Login Form Implementation 1. Install Dependencies

npm install react-hook-form zod @hookform/resolvers

    2.	Create Validation Schema

In the schemas directory, define a Zod schema for the login form:

// schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
email: z.string().email('Invalid email address'),
password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

    3.	Implement the Form

// components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../schemas/loginSchema';
import { Form } from 'shadcn-ui';

const LoginForm = () => {
const form = useForm<LoginSchema>({
resolver: zodResolver(loginSchema),
defaultValues: {
email: '',
password: '',
},
});

const onSubmit = (data: LoginSchema) => {
// Handle form submission
};

return (

<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)}>
{/_ Form fields _/}
</form>
</Form>
);
};

export default LoginForm;

Backend Setup 1. Configure Prisma with PostgreSQL
• Install Dependencies:

npm install prisma @prisma/client

    •	Initialize Prisma:

npx prisma init

    •	Configure schema.prisma:

// prisma/schema.prisma
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model User {
id String @id @default(uuid())
email String @unique
password String
// Add additional fields as needed
}

    •	Set Up Environment Variables:

In your .env file, add:

DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

    •	Generate Prisma Client and Push to Database:

npx prisma generate
npx prisma db push

    2.	Implement User Creation with Password Hashing
    •	Install Bcrypt:

npm install bcryptjs @types/bcryptjs

    •	Hash Passwords Before Saving:

import bcrypt from 'bcryptjs';

const hashPassword = async (password: string) => {
const salt = await bcrypt.genSalt(10);
return await bcrypt.hash(password, salt);
};

NextAuth Configuration 1. Install NextAuth v5

npm install next-auth@beta

    2.	Set Up NextAuth
    •	Create auth.ts:

// auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/prisma'; // Ensure this points to your Prisma instance
import bcrypt from 'bcryptjs';

export const authOptions = {
adapter: PrismaAdapter(prisma),
providers: [
CredentialsProvider({
name: 'Credentials',
credentials: {
email: { label: 'Email', type: 'email' },
password: { label: 'Password', type: 'password' },
},
authorize: async (credentials) => {
const user = await prisma.user.findUnique({
where: { email: credentials?.email },
});

        if (user && credentials?.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return { id: user.id, email: user.email };
          }
        }
        return null;
      },
    }),
    // Add additional providers as needed

],
callbacks: {
async jwt({ token, user }) {
if (user) {
token.id = user.id;
}
return token;
},
async session({ session, token }) {
if (token) {
session.user.id = token.id;
}
return session;
},
},
secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
