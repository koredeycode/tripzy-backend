import { Express } from "express";

export const listEndpoints = (app: Express, port: string | number) => {
  const routes = [
    { method: "GET", path: "/api" },
    
    // User Routes
    { method: "POST", path: "/api/users" },
    { method: "PUT", path: "/api/users/:id" },
    { method: "GET", path: "/api/users/:id/rides" },

    // Ride Routes
    { method: "POST", path: "/api/rides" },
    { method: "GET", path: "/api/rides/:id" },

    // Driver Routes
    { method: "GET", path: "/api/drivers" },
    { method: "GET", path: "/api/drivers/:id" },

    // Stripe Routes
    { method: "POST", path: "/api/stripe/create" },
    { method: "POST", path: "/api/stripe/webhook" },

    // Chat Routes
    { method: "POST", path: "/api/chat/conversations" },
    { method: "GET", path: "/api/chat/conversations" },
    { method: "POST", path: "/api/chat/messages" },
    { method: "GET", path: "/api/chat/messages/:conversationId" },
    { method: "POST", path: "/api/chat/read" },
    { method: "GET", path: "/api/chat/unread/:userId" },
  ];

  console.log("\n🚀 API Running at: http://localhost:" + port);
  console.log("\n📝 Available Endpoints:");
  console.table(routes);
};
