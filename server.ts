import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup body parsers
  app.use(express.json());

  // Health check endpoint for Cloud Run container probes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Initialize server-side Gemini client safely
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log('Gemini API client initialized successfully in backend.');
    } catch (err) {
      console.error('Error initializing Gemini client:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY environment variable is not defined. Falling back to high-fidelity static algorithm.');
  }

  // API to generate personalized suggestions
  app.post('/api/generate-goal', async (req, res) => {
    const { age, gender, category, currentHabitLevel, timeCommitment, motivation, friction, livingArrangement, primaryConstraint } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    if (!ai) {
      // If API key is not configured, send a log and succeed silently with fallback
      console.log('No Gemini API client key or initialization failed. Serving rich response from local database.');
      return res.json({ hasAI: false, message: "Served by Habits for a Better World scientific local algorithm." });
    }

    try {
      const systemInstruction = 
        `You are a senior behavioral scientist and change-management specialist representing "Habits for a Better World" (https://www.habitsforabetterworld.org/).
Your specialty is designing highly customized, extremely high-leverage micro-habits that fit seamlessly into people's actual daily routines while generating massive global and personal benefits.
Your writing style is highly authentic, professional, persuasive, warm, and intellectually sound. Avoid generic fluff or clinical medical jargon. Under no circumstances include self-praising words or marketing slop. Use precise behavioral cues.

You will recommend 1 primary TOP goal and 3 alternative options for the chosen area of action: ${category}.
Take the user profile and their living constraints into absolute focus:
- Age: ${age} years old
- Self-Reported Gender Identity: ${gender}
- Current Habit Level in this category: ${currentHabitLevel}
- Daily Time Commitment limit: ${timeCommitment}
- Core Motivation: ${motivation}
- Primary Friction Barrier: ${friction}
- Household/Living Arrangement: ${livingArrangement}
- Pressing Lifestyle Focus / Constraint: ${primaryConstraint}

Ensure the top recommended goal's action is tailored directly to their constraints:
- If they live with family/children, make the habit cooperative and child-friendly, or easy to do without interrupting family routines.
- If they live alone or with roommates, style it to suit that space privacy level.
- If they have a tight budget/cost constraint, make it free or show how it actively saves them money (like utility offsets or cheap food swaps).
- If they are extremely busy/low energy, ensure it takes less than 3-5 minutes with zero setup friction.
- If they are trying to keep in shape, design the action to contain or support physical fitness or body movement.

The action should be extremely simple and tangible (e.g. "Replacing a portion of your meat with high-protein legumes/beans", "A cold shower finish", "Placing the device in another room").
The impact stated MUST BE designed to specifically SELL this target individual (based on their exact age, gender, motivation, friction, living arrangement, and constraints) on committing to the 3-month challenge. Synthesize and quantify their personal, health, budget, social, or systemic impact over 3 months using scientifically grounded metrics.

Output your exact recommendation following the structured JSON schema.`;

      const promptMsg = `Create 1 Top recommended goal and 3 alternative option goals in the category "${category}" for a user profile:
Gender: ${gender}
Age: ${age}
Motivation: ${motivation}
Limit: ${timeCommitment}
Friction: ${friction}
Living Arrangement: ${livingArrangement}
Pressing Constraint: ${primaryConstraint}

The topGoal must have a unique ID like "ai-top", the alternatives should have IDs like "ai-alt-1", "ai-alt-2", "ai-alt-3".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptMsg,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topGoal: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  action: { type: Type.STRING, description: "A simple, highly specific, tangible habit action to do daily." },
                  impact: { type: Type.STRING, description: "The tailored, persuasive 3-month impact story designed specifically to sell/inspires a person of this age, gender, and motivation." },
                  category: { type: Type.STRING }
                },
                required: ["id", "title", "action", "impact", "category"]
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    action: { type: Type.STRING, description: "Alternative action in same field." },
                    impact: { type: Type.STRING, description: "Persuasive 3-month impact statement fit for their routine." },
                    category: { type: Type.STRING }
                  },
                  required: ["id", "title", "action", "impact", "category"]
                },
                description: "Exactly 3 alternative action options."
              }
            },
            required: ["topGoal", "alternatives"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      const generatedData = JSON.parse(responseText.trim());
      return res.json({ hasAI: true, data: generatedData });

    } catch (error: any) {
      console.error('Failed to run server-side Gemini API generate-goal:', error);
      return res.json({ 
        hasAI: false, 
        error: error.message || 'Error occurred during AI generation.',
        message: "Falling back to scientific local templates due to temporary api gateway delay."
      });
    }
  });

  // Serve static files in production or run Vite Dev Server middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server mounted as Express middleware.');
  } else {
    // Robust resolution of dist directory whether run directly or from dist/server.cjs
    let distPath = path.resolve(process.cwd(), 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html')) && fs.existsSync(path.join(__dirname, 'index.html'))) {
      distPath = __dirname;
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found.');
      }
    });
    console.log('Serving production static distribution from:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Habits for a Better World onboarding application container loaded.`);
    console.log(`Server actively running on interface http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
