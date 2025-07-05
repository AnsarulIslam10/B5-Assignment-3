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

borrowRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const result = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $unwind: '$book'
      },
      {
        $project: {
          _id: 0,
          totalQuantity: 1,
          book: {
            title: '$book.title',
            isbn: '$book.isbn'
          }
        }
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limitNum }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }

    ]);
    const borrowData = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limitNum);
    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: {
        borrows: borrowData,
        pagination: {
          total,
          totalPages,
          currentPage: pageNum,
          limit: limitNum
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    })
  }
})