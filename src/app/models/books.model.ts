import { model, Schema } from 'mongoose'
import { IBook, IBookModel } from '../interfaces/books.interface'

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true, enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'] },
  isbn: { type: String, required: true, unique: true },
  description: String,
  copies: { type: Number, required: true, min: [0, 'Copies must be a positive number'] },
  available: { type: Boolean, default: true }
},
  {
    versionKey: false,
    timestamps: true
  }
)

bookSchema.statics.decreaseCopies = async function (
  bookId: string,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) throw new Error('Book not found');
  if (book.copies < quantity) throw new Error('Not enough copies available');

  book.copies -= quantity;
  if (book.copies === 0) {
    book.available = false;
  }

  await book.save();
  return book;
};


export const Book = model<IBook, IBookModel>("Book", bookSchema)