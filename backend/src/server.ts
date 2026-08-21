import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============ Status Routes ============

const statusSchema = z.object({
  content: z.string().min(1),
  mood: z.string().optional(),
});

app.get('/api/statuses', async (_req, res) => {
  const statuses = await prisma.status.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(statuses);
});

app.get('/api/statuses/:id', async (req, res) => {
  const status = await prisma.status.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!status) return res.status(404).json({ error: 'Not found' });
  res.json(status);
});

app.post('/api/statuses', async (req, res) => {
  const data = statusSchema.parse(req.body);
  const status = await prisma.status.create({ data });
  res.status(201).json(status);
});

app.put('/api/statuses/:id', async (req, res) => {
  const data = statusSchema.partial().parse(req.body);
  const status = await prisma.status.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json(status);
});

app.delete('/api/statuses/:id', async (req, res) => {
  await prisma.status.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).end();
});

// ============ Journal Routes ============

const journalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  mood: z.string().optional(),
});

app.get('/api/journals', async (_req, res) => {
  const journals = await prisma.journal.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(journals);
});

app.get('/api/journals/:id', async (req, res) => {
  const journal = await prisma.journal.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!journal) return res.status(404).json({ error: 'Not found' });
  res.json(journal);
});

app.post('/api/journals', async (req, res) => {
  const data = journalSchema.parse(req.body);
  const journal = await prisma.journal.create({ data });
  res.status(201).json(journal);
});

app.put('/api/journals/:id', async (req, res) => {
  const data = journalSchema.partial().parse(req.body);
  const journal = await prisma.journal.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json(journal);
});

app.delete('/api/journals/:id', async (req, res) => {
  await prisma.journal.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).end();
});

// ============ Dish Routes ============

const dishSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  ingredients: z.string().optional(),
  difficulty: z.number().min(1).max(5).default(1),
  imageUrl: z.string().optional(),
  available: z.boolean().default(true),
});

app.get('/api/dishes', async (req, res) => {
  const { category, available } = req.query;
  const where: any = {};
  if (category) where.category = category;
  if (available !== undefined) where.available = available === 'true';

  const dishes = await prisma.dish.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(dishes);
});

app.get('/api/dishes/:id', async (req, res) => {
  const dish = await prisma.dish.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!dish) return res.status(404).json({ error: 'Not found' });
  res.json(dish);
});

app.post('/api/dishes', async (req, res) => {
  const data = dishSchema.parse(req.body);
  const dish = await prisma.dish.create({ data });
  res.status(201).json(dish);
});

app.put('/api/dishes/:id', async (req, res) => {
  const data = dishSchema.partial().parse(req.body);
  const dish = await prisma.dish.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json(dish);
});

app.delete('/api/dishes/:id', async (req, res) => {
  await prisma.dish.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).end();
});

// ============ Order Routes ============

const orderSchema = z.object({
  dishId: z.number(),
  note: z.string().optional(),
});

const orderStatusSchema = z.object({
  status: z.enum(['pending', 'cooking', 'done', 'cancelled']),
});

app.get('/api/orders', async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { dish: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

app.get('/api/orders/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: { dish: true },
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

app.post('/api/orders', async (req, res) => {
  const data = orderSchema.parse(req.body);
  const order = await prisma.order.create({
    data,
    include: { dish: true },
  });
  res.status(201).json(order);
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const data = orderStatusSchema.parse(req.body);
  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data,
    include: { dish: true },
  });
  res.json(order);
});

app.delete('/api/orders/:id', async (req, res) => {
  await prisma.order.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).end();
});

// ============ Categories ============

app.get('/api/categories', async (_req, res) => {
  const dishes = await prisma.dish.findMany({
    select: { category: true },
    distinct: ['category'],
  });
  res.json(dishes.map((d) => d.category));
});

// ============ Error Handling ============

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============ Start Server ============

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
