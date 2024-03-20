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

app.get('/watchlist', (req, res) => {
    res.send('You are now at /watchlist');
});

app.get('/portfolio', (req, res) => {
    res.send('You are now at /portfolio');
});

