import mongoose from "mongoose";

const SkillsSchema = new mongoose.Schema({
  skills: {
    type: Array,
    required: true,
  },
});

const Skills = mongoose.model("Skills", SkillsSchema);

export default Skills;
