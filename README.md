# Next.js Authentication Implementation Guide

## Overview

This guide provides a comprehensive approach to implementing a robust authentication system in a Next.js application. It covers project setup, backend and frontend integration, validation, database configuration, and integration with providers such as Google and GitHub. Follow these steps to build a secure and scalable authentication system.

---

## Table of Contents

- [Project Setup](#1-project-setup)
- [Project Structure](#2-project-structure)
- [Login Form](#3-login-form)
- [Backend Setup](#4-backend-setup)
- [Frontend Optimization](#5-frontend-optimization)
- [Database Configuration](#6-database-configuration)
- [Prisma Adapter and User Management](#7-prisma-adapter-and-user-management)
- [Next Auth Setup](#8-next-auth-setup)
- [Authentication Callbacks](#9-authentication-callbacks)
- [Provider Implementation: Google | Github](#10-provider-implementation-google-github)
- [Handling Same Email in Different Providers](#11-when-same-email-in-different-providers)
- [Events: Linked Account](#12-events-for-linked-account)
- [Email Verification](#13-email-verification)
- [Session in Client Component](#14-session-in-client-component)
- [Notification with Sonner](#15-sonner-is-used-for-notification)
- [Settings](#16-settings)

---

## Technologies Used

- **Next.js**: A React framework for building fast, scalable web applications.
- **Shadcn UI**: A library for building consistent and accessible UI components.
- **React**: A JavaScript library for building user interfaces.
- **React Hook Form**: A library for handling form state and validations in React applications.
- **Zod**: A schema-based validation library for TypeScript.
- **Prisma**: An ORM for TypeScript and Node.js to manage database interactions.
- **Next Auth**: An authentication solution for Next.js applications.
- **bcrypt**: A library used for hashing passwords securely.
- **@auth/prisma-adapter**: A Prisma adapter for integrating with Next Auth.
- **react-icons**: A library providing scalable vector icons.
- **Sonner**: A library for notifications in Next.js applications.
- **TypeScript**: A statically typed programming language that builds on JavaScript.
- **Node.js**: A JavaScript runtime used for backend development.
- **PostgreSQL**: A powerful, open-source relational database system.
- **Neon**: Serverless PostgreSQL service for development environments.

---

## 1. Project Setup

- **Create a New Project**: Use `create-next-app@latest -d` to set up a new Next.js project.
- **Install Shadcn**: Execute `npx shadcn-ui@latest init` to initialize the UI library for components such as Button, Card, and Input.
- **Icons**: Add `react-icons` to incorporate various icons into your application.

---

## 2. Project Structure

- **Authentication Module**:
  - Create a login component under the `auth` directory.
  - Use a card wrapper to encapsulate the login component. This wrapper should take parameters such as header label, back button label, back button href, and a boolean `show social` for social icons.
  - Use the card component from Shadcn for styling, with children components for content and footer.

---

## 3. Login Form

- **Setup Validation Schemas**:

  - Create a `schemas` folder in the root directory and include `react-hook-form`, `zod`, and `@hookform/resolvers` for form validation.
  - Define the schema for the login form using `zod`.

- **Form Handling**:
  - Utilize `useForm()` to manage form states and validations.
  - Infer types using `z.infer<typeof loginschema>` and resolve validations with `zodResolver`.
  - Implement the form within a Form wrapper and manage submissions with `form.handleSubmit()`.

---

## 4. Backend Setup

- **Action Handling**:
  - Use async functions and include `'use server'` directive for server actions.

---

## 5. Frontend Optimization

- **Handling Transitions**:
  - Utilize `useTransition()` to manage pending states and initiate transitions using `startTransition()`.

---

## 6. Database Configuration

- **Database and ORM Setup**:
  - Use Postgres via Neon serverless driver, set in `.env`.
  - Implement Prisma as the ORM. Ensure global DB setup in development through `lib/prisma.ts`, referring to Prisma documentation.
  - Initialize Prisma with `prisma init` and generate necessary files with `npx prisma generate && npx prisma db push`.

---

## 7. Prisma Adapter and User Management

- **Prisma Adapter**:
  - Install `@auth/prisma-adapter` and follow the Auth.js Prisma documentation.
- **User Management**:

  - Use bcrypt (or bcryptjs for compatibility issues) to hash passwords, and ensure `@types/bcrypt` is installed for TypeScript.

  - `npx prisma generate`: generate types of dev
  - `npx prisma db push`: creates model to db

---

## 8. Next Auth Setup

- **Next Auth Installation**:

  - Install Next Auth v5 by following the migration guide.
  - Implement the provided `auth.ts` and API routes from `app/api/auth/[...nextauth]/route.ts`.
  - Set a secret key in `.env` using `npx auth secret`.

- **Configuration**:
  - Define `auth.config.ts` with `Credentials()` for email/password authentication.
  - Implement an `authorize()` function for credential validation and user authentication.
  - Handle potential bcrypt errors by switching to bcryptjs if necessary.

---

## 9. Authentication Callbacks

- **Callbacks Configuration**:
  - Customize `signIn()`, `jwt()`, and `session()` callbacks in `auth.ts` for enhanced authentication processes.
  - Ensure handling of user roles and permissions by attaching them to the session object from the JWT token.
- **Ensure Type Safety**:
  - Create an `auth-next.d.ts` file for TypeScript support following the Auth.js TypeScript resources.

---

## 10. Provider Implementation: Google | Github

- Go to Google Console and GitHub Developer Settings and get ID and secret of each for `.env`.
- Follow docs providers: Google | GitHub in authjs.dev.
- Use `signIn(providerName, {redirectTo: ‘/‘})` callback from `next-auth/react` to invoke provider login.

---

## 11. When Same Email in Different Providers

- Ensure default signIn page is changed to custom `’/auth/login’` in `pages[]` in `auth.ts`:
  - `pages: {signIn: ‘/auth/login’, error: ‘/auth/error’}`
- Handle email already linked to other provider in URL error `OAuthAccountNotLinked` in login page:
  - Use that error and `setError` to show email already in use with other providers.

---

## 12. Events: Linked Account

- **Callback Events**:
  - `linkedAccount()` -> `void`:
    - When provider email is already in db but emailVerified.
    - Use this event to update `emailVerified` by using `token.sub` for id to get user and update.

---

## 13. Email Verification

- Whenever a register occurs via Credentials, a verification token is created and sent to the user email.
- User opens email and redirects to verify page where token is validated.
- Redirect to home page once validated.

- If user is not verified then also send confirmation email when login.
- Ensure check in `signIn()` callback in `auth.ts` if email is verified, if not return `false`, for extra security.

---

## 14. Session in Client Component

- **Using session in client component** requires `@next-auth/react`.
- Also need to wrap inside layout into `<sessionprovider session={session}>` to get the session for all shared children:

  - Even though `sessionProvider` comes from `@next-auth/react`, session is async coming from `@auth.ts`.

- Use `useSession()` to get session details. Can also create own hooks based on that.

---

## 15. Sonner is used for Notification

---

## 16. Settings

- Whenever you make changes to db in UI, make sure you update `session()` using `update()` from `useSession()` in `@next-auth/react`.
- Also, ensure to include everything needed for the user in token in `jwt` callback after getting user data, which then passes to session where you finally put everything into the user object as `jwt` is called every time anything changes in app to check session/token expiry.

---

## What I Learned

Authentication is crucial for any business that cares about their customers.  
Having a deep layer of validation and authentication can prevent hackers from getting into the database.

---

## Conclusion

By following this comprehensive guide, you can set up a secure and scalable authentication system for your Next.js application using the best practices and tools available.
