const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Yooo you need to say node filename arg1 arg2...')
    console.log('etc. arg2 being the Atlas password for the DB')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://cadenceelaina:${password}@cluster0.uzjslz9.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    /*     id: Number, */
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

/* const person = new Person({
    id: 1,
    name: name,
    number: number,
})
 */
/* const person = new Person({
    id: 1,
    name: 'Cadence Elaina',
    number: '69-420',
}) */

if (process.argv.length === 3) {
    console.log('works')
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

}
else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook!`)
        mongoose.connection.close()
    })
}