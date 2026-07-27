import express from "express"
import customError from "./utils/customError.js"
import categoryRoutes from "./Routes/category.js"
import serviceRoutes from "./Routes/service.js"
import bookingRoutes from "./Routes/booking.js"
import globalErrorHandler from "./controllers/errors.js"

const app = express();

app.use(express.json())
app.set('query parser', 'extended');

app.use("/api/v1", categoryRoutes)
app.use("/api/v1", serviceRoutes)
app.use("/api/v1", bookingRoutes)

app.all('/*path', (req, res, next) => {
    const error = new customError(`Cant find ${req.originalUrl} url`, 404)
    next(error)
})

app.use(globalErrorHandler)

export default app