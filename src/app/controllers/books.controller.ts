// books.controller.ts

import express, { Request, Response } from 'express'
import { Book } from '../models/books.model'
export const booksRoutes = express.Router()
//Create books
booksRoutes.post('/', async (req: Request, res: Response) => {
    const body = req.body
    const data = await Book.create(body)
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data
    })
})

//get all books
booksRoutes.get('/', async (req: Request, res: Response) => {

    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query

        const query: any = {};
        if (filter) {
            query.genre = filter;
        }

        const sortOption: any = {};
        sortOption[sortBy as string] = sort === 'asc' ? 1 : -1;

        const books = await Book.find(query).sort(sortOption).limit(Number(limit))

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error: (error as Error).message,
        })
    }

})

//get single book
booksRoutes.get('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId
    const data = await Book.findById(bookId)

    res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data
    })

})

//Update single book
booksRoutes.patch('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId
    const body = req.body
    const data = await Book.findByIdAndUpdate(bookId, body, {new: true})

    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data
    })

})

//Delete single book
booksRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId
    await Book.findByIdAndDelete(bookId)

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null
    })

})