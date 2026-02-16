import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this image to a specific user
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // We will store the Base64 string here
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Image', imageSchema);