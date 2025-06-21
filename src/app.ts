// app.ts
import { borrowRoutes } from './app/controllers/borrow.controller';

import express, { Application, Request, Response } from 'express'
import { booksRoutes } from './app/controllers/books.controller'
const app: Application = express()
app.use(express.json())
app.use("/api/books", booksRoutes)
app.use('/api/borrow', borrowRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to Library Management")
})

export default app;