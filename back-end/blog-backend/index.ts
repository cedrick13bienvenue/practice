import express from 'express';
import cors from 'cors';
import blogRoutes from './routes/blog-routes';

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());
app.use('/', blogRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at PORT:${PORT}`);
});
