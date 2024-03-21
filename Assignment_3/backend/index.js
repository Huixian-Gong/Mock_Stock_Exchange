const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

const FINNHUB_API_KEY = 'cms4589r01qlk9b11g1gcms4589r01qlk9b11g20';
const POLYGON_API_KEY = 'wjYgWwDJ_fIrb0Iem90No7WkqTF1yyYu';

app.use(cors()); 

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

app.get('/', (req, res) => {
    res.redirect('/search/home');
})

app.get('/search/home', (req, res) => {
    res.send('You are now at /search/home');
});

app.get('/ticker/:query', async (req, res) => {
  const query = req.params.query;
  const url = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Finnhub' });
  }
});

app.get('/search/:ticker', async (req, res) => {
    const ticker = req.params.ticker;
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data from Finnhub' });
    }
  });

app.get('/quote/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Finnhub' });
  }
});


app.get('/peers/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Finnhub' });
  }
});

app.get('/news/:ticker/:from/:to', async (req, res) => {
  const ticker = req.params.ticker;
  const from = req.params.from;
  const to = req.params.to;
  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Finnhub news' });
  }
});

app.get('/stock/hourly/:ticker/:from/:to', async (req, res) => {
  const ticker = req.params.ticker;
  const from = req.params.from;
  const to = req.params.to;
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${from}/${to}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
  // console.log(url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Polygon' });
  }
});

app.get('/chart/:ticker/:from/:to', async (req, res) => {
  const ticker = req.params.ticker;
  const from = req.params.from;
  const to = req.params.to;
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Polygon' });
  }
});

app.get('/watchlist', (req, res) => {
    res.send('You are now at /watchlist');
});

app.get('/portfolio', (req, res) => {
    res.send('You are now at /portfolio');
});

