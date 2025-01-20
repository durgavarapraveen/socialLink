import mongoose from "mongoose";

const ImagesSchema = new mongoose.Schema({
  images: {
    type: Array,
    required: true,
  },
});

const Images = mongoose.model("Images", ImagesSchema);

export default Images;
