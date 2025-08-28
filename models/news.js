import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },  
    description: { type: String, required: true },
    img: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now }
});

const News = mongoose.model('News', newsSchema);
export default News;