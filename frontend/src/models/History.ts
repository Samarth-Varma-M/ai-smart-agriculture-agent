import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: String,
  weather: String,
  commodity: String,
  image: String, // Can store base64 string or url
  query: String,
  diagnosis: String,
}, { timestamps: true });

export default mongoose.models.History || mongoose.model('History', HistorySchema);
