import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { InferenceClient } from '@huggingface/inference'; //
import authRoutes from './routes/auth.js';
import Image from './models/Image.js';
import { protect } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "https://ali-s-ai.vercel.app",
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

  // Mount Auth Routes
app.use('/api/auth', authRoutes);

// Initialize the Hugging Face client with your API key
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// 1. UPDATE THIS ROUTE: Protect it and save to DB
app.post('/api/generate-image', protect, async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "A prompt is required" });

        // Generate with Hugging Face
        const imageBlob = await hf.textToImage({
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            inputs: prompt,
        });

        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

        // Save the generated image to MongoDB, linked to the logged-in user
        const newImage = await Image.create({
            user: req.user.id, // Grabbed from the protect middleware
            prompt: prompt,
            imageUrl: base64Image
        });

        res.status(200).json({ success: true, image: newImage });

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ success: false, error: "Failed to generate image." });
    }
});

// 2. ADD THIS NEW ROUTE: Fetch user's personal history
app.get('/api/history', protect, async (req, res) => {
    try {
        // Find all images belonging to this user, sorted by newest first
        const images = await Image.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, images });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch image history." });
    }
});

// DELETE Route: Remove an image
app.delete('/api/images/:id', protect, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) return res.status(404).json({ error: "Image not found" });

        // Ensure the user trying to delete owns the image
        if (image.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        await image.deleteOne();
        res.status(200).json({ success: true, message: "Image deleted" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: "Failed to delete image" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});