import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
  name: String,
  distance: String,
  duration: String,
  price: Number,
});

export default mongoose.models.Route || mongoose.model('Route', RouteSchema);