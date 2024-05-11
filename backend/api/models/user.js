// https://www.youtube.com/watch?v=_EP2qCmLzSE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=11
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
        // Argument passed in must be a single String of 12 bytes or a string of 24 hex (1,2,...,E,F) characters
        _id: mongoose.Schema.Types.ObjectId,
        email: {
                type: String, 
                required: true, 
                unique: true, 
                match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
        password: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);