const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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

/* morgan.token("data", (request) => {
    return request.method === "POST" ? JSON.stringify(request.body) : " ";
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms")) */
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hi uwu ^-^ D:</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const generateId = () => {
    /*  const maxId = persons.length > 0
         ? Math.max(...persons.map(p => p.id))
         : 0
     return maxId + 1 */
    const rand = Math.random() * 1000 + 10
    return rand
}

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    if (persons.some(person => person.number === body.number)) {
        return response.status(400).json({
            error: 'number must be unique'
        })
    }



    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {
    /*     const currentDate = new Date().toLocaleDateString()
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone */
    const currentDate = new Date().toString()
    /*     console.log(timeZone, currentDate) */
    response.send(`
    <div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentDate}</p>
    </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})






const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})