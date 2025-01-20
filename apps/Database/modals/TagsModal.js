import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
  tags: {
    type: Array,
    required: true,
  },
});

const Tags = mongoose.model("Tags", TagsSchema);

export default Tags;
