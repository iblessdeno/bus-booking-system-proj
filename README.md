# Bus Booking and Management System
![image](https://github.com/user-attachments/assets/90a77dee-ff8b-4b9c-a706-2285b4514373)

## Overview

This is a comprehensive bus booking and management system built with Next.js and Firebase. It provides a robust platform for managing bus routes, bookings, payments, and analytics.

## Features

- **Route Management**: Add and manage bus routes with details like distance, duration, and price.
- **Booking System**: Allow users to book tickets for available routes.
- **Payment Processing**: Handle payments and maintain a payment history.
- **Analytics Dashboard**: Visualize booking trends and revenue data.
- **User Authentication**: Secure login system for administrators.

## Technology Stack

- **Frontend**: 
  - Next.js 13+ (React framework)
  - TypeScript
  - Tailwind CSS for styling
  - Shadcn UI components
  - Lucide React for icons
  - Recharts for data visualization

- **Backend**:
  - Firebase (Firestore for database)
  - Firebase Authentication

- **State Management**:
  - React Hooks

- **Date Handling**:
  - date-fns

## Firebase Firestore Integration

The system heavily utilizes Firebase Firestore for data management. Key Firestore operations include:

## How to Clone and Run Locally

1. **Clone the repository**
   ```
   git clone https://github.com/your-username/bus-booking-system.git
   cd bus-booking-system
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore and Authentication services
   - Add a web app to your Firebase project and copy the configuration

4. **Configure environment variables**
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```
   npm run dev
   ```

6. **Open the application**
   Navigate to `http://localhost:3000` in your web browser to see the application running.

## Deployment

For deployment instructions, please refer to the deployment documentation of your preferred hosting platform (e.g., Vercel, Netlify, or Firebase Hosting).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
