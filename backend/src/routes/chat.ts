import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string()
});

export async function chatRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: any }>("/api/chat", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { message, sessionId } = chatSchema.parse(request.body);

      // STRICT MENU VALIDATION
      const reply_text = await processMessage(message);

      return reply.send({
        reply: reply_text,
        cart: [], // TODO: implement cart
        sessionId
      });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get<{ Params: { restaurantId: string } }>("/api/config/:restaurantId", async (request: FastifyRequest<{ Params: { restaurantId: string } }>, reply: FastifyReply) => {
    // Return the menu config (from woody-menu-config.json or database)
    const config = {
      restaurantInfo: {
        name: "Woody's Burger, Chicken & Ribs",
        location: "37 London Street, Andover, SP10 2NU, UK"
      },
      categories: [
        {
          id: "peri-peri",
          name: "🌶️ Peri Peri Chicken",
          items: [
            { id: "peri-wrap", name: "Peri Peri Chicken Wrap & Fries", price: 6.99, description: "Fresh grilled peri peri chicken" },
            { id: "peri-wings", name: "5pcs Peri Peri Wings & Fries", price: 6.99, description: "Spicy wings with fries" }
          ]
        },
        {
          id: "burgers",
          name: "🍔 Burgers",
          items: [
            { id: "cluffie", name: "Cluffie", price: 6.20, description: "Plain beef burger" },
            { id: "cheese-job", name: "Cheese Job", price: 6.50, description: "Beef burger with melted cheddar" },
            { id: "hot-stuff", name: "Hot Stuff", price: 6.90, description: "Beef burger with chilli sauce" }
          ]
        },
        {
          id: "sides",
          name: "🍟 Sides",
          items: [
            { id: "fries", name: "Fries", price: 2.50, description: "Golden crispy fries" },
            { id: "wings", name: "BBQ Wings", price: 4.95, description: "6 piece BBQ wings" }
          ]
        }
      ],
      prompts: {
        welcomeMessage: "👋 Hey there! I'm Sophia, your ordering assistant at Woody's. What can I help you with today? 🍔🌶️"
      }
    };

    return reply.send(config);
  });
}

// STRICT MENU-LOCKING LOGIC
const MENU_ITEMS = {
  "peri-wrap": { name: "Peri Peri Chicken Wrap & Fries", price: 6.99 },
  "peri-wings": { name: "5pcs Peri Peri Wings & Fries", price: 6.99 },
  "cluffie": { name: "Cluffie", price: 6.20 },
  "cheese-job": { name: "Cheese Job", price: 6.50 },
  "hot-stuff": { name: "Hot Stuff", price: 6.90 },
  "fries": { name: "Fries", price: 2.50 },
  "wings": { name: "BBQ Wings", price: 4.95 }
};

const KEYWORDS_TO_ITEMS: Record<string, string> = {
  "peri": "peri-wrap",
  "wrap": "peri-wrap",
  "wings": "peri-wings",
  "cluffie": "cluffie",
  "cheese": "cheese-job",
  "hot": "hot-stuff",
  "spicy": "hot-stuff",
  "fries": "fries",
  "chips": "fries"
};

function processMessage(message: string): string {
  const lower = message.toLowerCase();

  // Check if user is asking for something
  if (lower.includes("recommend") || lower.includes("what") || lower.includes("suggest")) {
    return "We have amazing Peri Peri Chicken, Burgers, and delicious Sides! What interests you? 😋";
  }

  // Try to match menu items STRICTLY
  for (const [keyword, itemId] of Object.entries(KEYWORDS_TO_ITEMS)) {
    if (lower.includes(keyword)) {
      const item = MENU_ITEMS[itemId];
      if (item) {
        return `Great choice! Our ${item.name} is £${item.price.toFixed(2)}. Ready to add it to your order? 🎉`;
      }
    }
  }

  // If nothing matched, stay on menu
  return "I can only help with items from our menu. We have amazing burgers, peri peri chicken, and sides. What sounds good? 🍽️";
}
