const Joi = require('joi');
const mongoose = require('mongoose');

const Image = mongoose.model('Image', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  link: {
    type: String,
    required:true
  },
  description: { 
    type: String, 
    required: true,
    min: 0,
    max: 255
  },
  user: {
    type: String
  },
  date: {
    type:Date,
    default: Date.now()
  },
  last_update: {
    type:Date,
    default: Date.now()
  }
}));

function validateImage(Image) {
  const schema = new Joi.object({
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().required(),
    date: Joi.date()
  }).options({ allowUnknown: true });

  return schema.validate(Image);
}

exports.Image = Image; 
exports.validateImage = validateImage;