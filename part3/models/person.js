const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

//https://mongoosejs.com/docs/validation.html#custom-validators
const numberValidator = [
    {
        validator: (number) => {
            if (number.length < 9) {
                return false
            }
            return true
        },
        msg: "number must be at least 8 digits",
    },
    {
        validator: (number) => {
            return /^\d{2,3}-\d+$/.test(number)
        },
        msg: "invalid phone number",
    }
]


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: numberValidator,
        required: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)