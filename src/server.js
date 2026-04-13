import express from 'express';
import 'dotenv/config';
import { apiKey } from './lib/middlewares/apiKey.js';
import exemplosRoutes from './routes/exemploRoute.js';
import arquivoRoutes from './routes/arquivoRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api/exemplos', apiKey, exemplosRoutes);
app.use('/api/exemplos', apiKey, arquivoRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((error, req, res, next) => {
    if (error.name === 'MulterError') {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'Arquivo muito grande. O limite é 1MB.' });
        }

        return res.status(400).json({ error: error.message });
    }

    if (error.message === 'Tipo de arquivo não permitido.') {
        return res.status(400).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
