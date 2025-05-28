const authRoute = require('./authRoute')
const propertyRoute = require('./propertyRoute')
const savedPropertyRoute = require('./savedPropertyRoute')


const routes = [
    authRoute,
    propertyRoute,
    savedPropertyRoute
]

module.exports = routes