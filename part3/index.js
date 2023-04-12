require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))


/* const generateId = () => {
    /*  const maxId = persons.length > 0
         ? Math.max(...persons.map(p => p.id))
         : 0
     return maxId + 1 */
/*  const rand = Math.random() * 1000 + 10
 return rand
} */

app.get('/', (request, response) => {
    response.send('<h1>Hi uwu ^-^ D:</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({})
        .then((people) => {
            response.send(
                `<p>Phonebook has info for ${people.length
                } people</p><p>${new Date()}</p>`
            )
        })
        .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', async (request, response) => {
    const { name, number } = request.body
    if (!name && !number) {
        return res.status(400).json({
            error: 'The name and number are missing',
        })
    }
    if (!name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    let personExists = await Person.exists({ name: name })
    if (personExists) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    }

    /*  if (persons.some(person => person.name === name)) {
         return response.status(400).json({
             error: 'name must be unique'
         })
     }
     if (persons.some(person => person.number === number)) {
         return response.status(400).json({
             error: 'number must be unique'
         })
     } */

    const person = new Person({
        /*   id: generateId(), */
        name: name,
        number: number,
    })

    try {
        await person.save()
        response.json(person)
    } catch (error) {
        next(error)
    }
    /*     person
            .save()
            .then((savedPerson) => {
                response.json(savedPerson)
            })
            .catch((error) => next(error)) */
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    const person = new Person({
        /*  id: generateId(), */
        name: name,
        number: number,
    })

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})