# Next.js Admin Dashboard with TypeScript & Shadcn UI

**Admin Dashboard** - A modern, comprehensive admin dashboard with multiple layouts, authentication, customizable themes, and extensive features.

<img src="https://github.com/ryyott/admin-dashboard/blob/main/media/dashboard.png?version=5" alt="Dashboard Screenshot">

A feature-rich admin dashboard template built with the latest Next.js 16, TypeScript, and Tailwind CSS v4. Includes multiple dashboard variants (CRM, Analytics, Finance, Academy, Logistics), full-featured applications (Email, Chat, Calendar, Kanban), role-based access control, and an e-commerce showcase.

## Features

- Built with Next.js 16, TypeScript, Tailwind CSS v4, and Shadcn UI
- Responsive and mobile-friendly design
- Multiple dashboard variants: Default, CRM, Analytics, Finance, Academy, Logistics
- Full-featured applications: Email inbox, Chat system, Calendar, Kanban board
- Complete authentication flows with multiple layout variants
- Role-Based Access Control (RBAC) system with permissions matrix
- User management with organization charts
- Invoice management with AI assistant
- E-commerce product showcase (Yeezy-inspired)
- Customizable theme presets (Tangerine, Neo Brutalism, Soft Pop)
- Flexible layouts with collapsible sidebar and adjustable content widths  

> [!NOTE]
> The default dashboard uses the **shadcn neutral** theme.  
> It also includes additional color presets inspired by [Tweakcn](https://tweakcn.com):  
>
> - Tangerine  
> - Neo Brutalism  
> - Soft Pop  
>
> You can create more presets by following the same structure as the existing ones.

  

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4  
- **UI Components**: Shadcn UI  
- **Validation**: Zod  
- **Forms & State Management**: React Hook Form, Zustand  
- **Tables & Data Handling**: TanStack Table  
- **Tooling & DX**: ESLint, Prettier, Husky  

## Screens

### Dashboards
- Default Dashboard with interactive charts
- CRM Dashboard with customer insights
- Analytics Dashboard with sales metrics
- Finance Dashboard with currency exchange
- Academy Dashboard for education management
- Logistics Dashboard with shipment tracking

### Applications
- Email Inbox with AI compose assistant
- Chat Application with group support
- Calendar with event management
- Kanban Board with drag-and-drop
- Invoice Management with preview
- User Management with roles
- E-commerce Product Showcase

### Authentication
- Multiple login/register variants (v1, v2)
- Form validation with Zod
- Social authentication UI  
- Roles Management  

## Colocation File System Architecture

This project follows a **colocation-based architecture** each feature keeps its own pages, components, and logic inside its route folder.  
Shared UI, hooks, and configuration live at the top level, making the codebase modular, scalable, and easier to maintain as the app grows.

For a full breakdown of the structure with examples, see the [Next Colocation Template](https://github.com/arhamkhnz/next-colocation-template).

## Getting Started

You can run this project locally, or deploy it instantly with Vercel.

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fryyott%2Fadmin-dashboard)

_Deploy your own copy with one click._

### Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryyott/admin-dashboard.git
   ```

2. **Navigate into the project**
   ```bash
    cd admin-dashboard
   ```
   
3. **Install dependencies**
   ```bash
    npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

---

> [!IMPORTANT]  
> This project is updated frequently. If you’re working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.


**Happy Vibe Coding!**
