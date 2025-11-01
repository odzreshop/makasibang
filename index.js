import express from 'express';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('json spaces', 2);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const categories = {};
const endpoints = {};
let totalEndpoints = 0;

const endpointFiles = await glob('endpoints/**/*.js');

for (const file of endpointFiles) {
    if (file.startsWith('endpoints/_')) continue;
    const endpointModule = await import(`./${file}`);
    const endpoint = endpointModule.default;
    if (endpoint && endpoint.category && endpoint.name) {
        totalEndpoints++;
        const categoryName = endpoint.category;
        const categoryKey = categoryName.toLowerCase();
        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }
        categories[categoryName].push(endpoint);
        if (!endpoints[categoryKey]) {
            endpoints[categoryKey] = {};
        }
        endpoints[categoryKey][endpoint.name.toLowerCase().replace(/ /g, '-')] = endpoint;
    }
}

const sortedCategories = Object.keys(categories).sort().reduce((acc, key) => {
    acc[key] = categories[key].sort((a, b) => a.name.localeCompare(b.name));
    return acc;
}, {});

app.get('/', (req, res) => {
  res.render('index', { 
    categories: sortedCategories,
    totalEndpoints: totalEndpoints,
    totalCategories: Object.keys(sortedCategories).length
  });
});

app.post('/api/uploader/upload', upload.single('file'), async (req, res) => {
    try {
        const endpointModule = await import('./endpoints/uploader/upload.js');
        const endpoint = endpointModule.default;
        const result = await endpoint.execute({ file: req.file });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'An internal server error occurred' });
    }
});

app.all('/api/:category/:name', async (req, res) => {
  const categoryKey = req.params.category.toLowerCase();
  const nameKey = req.params.name.toLowerCase();
  const endpoint = endpoints[categoryKey]?.[nameKey];

  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  
  const requiredMethod = (endpoint.method || 'GET').toUpperCase();
  if (req.method === 'GET' && requiredMethod === 'POST') {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    let curlExample;
    
    if (endpoint.parameters.some(p => p.type === 'file')) {
        curlExample = `curl -F "file=@/path/to/your/file.jpg" "${req.protocol}://${req.get('host')}${req.path}"`;
    } else {
        curlExample = `curl -X ${requiredMethod} "${fullUrl}"`;
    }

    return res.status(405).json({
        error: "Method Not Allowed",
        message: `This endpoint requires a ${requiredMethod} request.`,
        usage_example: {
            curl: curlExample
        }
    });
  }
  
  if (typeof endpoint.execute !== 'function') {
    return res.status(500).json({ error: 'Endpoint implementation is invalid.' });
  }

  try {
    const result = await endpoint.execute({ ...req.query, ...req.body });
    res.json(result);
  } catch (error) {
    console.error(`Error executing endpoint: ${categoryKey}/${nameKey}`, error);
    res.status(500).json({ error: error.message || 'An internal server error occurred' });
  }
});

export default app;
