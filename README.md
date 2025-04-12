# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9d73baa0-fa49-4e38-8c42-77c53db15857

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9d73baa0-fa49-4e38-8c42-77c53db15857) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Package Manager Selection

This project uses npm as its primary package manager. If you prefer to use another package manager like Yarn or Bun, make sure to:

1. Delete the existing lock file (`package-lock.json`)
2. Configure VS Code to use your preferred package manager:
   - Open VS Code Settings
   - Search for "npm.packageManager"
   - Set it to "npm", "yarn", or "pnpm" as appropriate

### Environment Setup

This project uses environment variables for configuration:

1. Copy the `.env.example` file to create a new `.env` file
2. Fill in your Supabase credentials in the `.env` file
3. Restart your development server after changing environment variables

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (authentication and database)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9d73baa0-fa49-4e38-8c42-77c53db15857) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
