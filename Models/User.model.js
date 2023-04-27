const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// this is middle ware we use before POST

// UserSchema.post('save', async function(next){
//     try {
//       console.log('Called after saving user');
//     } catch (error) {

//     }
// });

const User = mongoose.model('user', UserSchema);
module.exports = User;
