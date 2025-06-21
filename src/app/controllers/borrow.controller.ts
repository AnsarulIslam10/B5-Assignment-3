import express, { Request, Response } from 'express'
import { Book } from '../models/books.model';
import { Borrow } from '../models/borrow.model';
export const borrowRoutes = express.Router();

borrowRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;

    if (!book || !quantity || !dueDate)
      throw new Error('book, quantity and dueDate are required');

    await Book.decreaseCopies(book, quantity);

    const borrowRecord = await Borrow.create({ book, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
});