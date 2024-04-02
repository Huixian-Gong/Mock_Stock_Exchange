const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000

const FINNHUB_API_KEY = 'cms4589r01qlk9b11g1gcms4589r01qlk9b11g20';
const POLYGON_API_KEY = 'wjYgWwDJ_fIrb0Iem90No7WkqTF1yyYu';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.c4afbhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    db = client.db("571-HW3")
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // console.log('client closed')
  }
}
run().catch(console.dir);


app.use(cors()); 

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

app.get('/', (req, res) => {
    res.send('Server connected!');
})

// app.get('/search/home', (req, res) => {
//     res.send('You are now at /search/home');
// });

app.get('/ticker/:query', async (req, res) => {
  const query = req.params.query;
  const url = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Apply the filtering criteria
    const filteredResults = data.result.filter(item => 
      item.type === 'Common Stock' && !item.symbol.includes('.')
    );

    // Send the filtered array back as the response
    res.json(filteredResults);
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

app.get('/recommendation/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const from = req.params.from;
  const to = req.params.to;
  const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Polygon' });
  }
});

app.get('/earning/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const from = req.params.from;
  const to = req.params.to;
  const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Polygon' });
  }
});

app.get('/insider/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const from = req.params.from;
  const to = req.params.to;
  const url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker}&from=2022-01-01&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Polygon' });
  }
});

app.get('/portfolio', async (req, res) => {
  if (!db) {
      return res.status(500).send('MongoDB not connected');
  }

  try {
    const collection = db.collection('favorites');

    // Find the portfolio document that contains stocks
    const portfolio = await collection.findOne({}, { projection: { "stocks": 1, _id: 0 } });
    // console.log(portfolio)
    if (portfolio) {
        // Filter out stocks that do not have 'quantity' key or have quantity of 0
        const stocks = portfolio.stocks.filter(stock => stock.count && stock.count > 0);
        res.json(stocks);
    } else {
        res.status(404).send('No portfolio found or no stocks with quantity greater than 0');
    }
  } catch (error) {
      console.error('Error fetching portfolio', error);
      res.status(500).send('Error fetching portfolio');
  }
});


app.get('/favorites/add/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  if (!db) {
    return res.status(500).send('MongoDB not connected');
  }

  try {
    const collection = db.collection('favorites');

    // Check if the ticker already exists and needs its watchlist status updated
    const existingDocument = await collection.findOne({ "stocks.ticker": ticker });

    if (existingDocument) {
      // Ticker exists, update its watchlist status
      const updateResult = await collection.updateOne(
        { "stocks.ticker": ticker },
        { $set: { "stocks.$.watchlist": true } }
      );
      if (updateResult.modifiedCount === 1) {
        return res.status(200).json({ success: true, message: `Ticker ${ticker} updated to watchlist.` });
      } else {
        return res.status(404).send({ success: false, message: 'Stock not found or no update needed' });
      }
    } else {
      // Ticker does not exist, add a new one
      const addToSetResult = await collection.updateOne(
        {},
        {
          $push: {
            stocks: {
              ticker: ticker,
              watchlist: true
            }
          }
        },
        { upsert: true }
      );
      if (addToSetResult.upsertedCount === 1 || addToSetResult.modifiedCount === 1) {
        return res.status(200).json({ success: true, message: `Ticker ${ticker} added to favorites with watchlist status.` });
      } else {
        return res.status(500).send('Failed to add stock to favorites');
      }
    }
  } catch (error) {
    console.error('Error handling stock in favorites', error);
    res.status(500).send(error.message);
  }
});


app.get('/favorites/remove/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  if (!db) {
    return res.status(500).send('MongoDB not connected');
}

try {
    const collection = db.collection('favorites');
    
    // Set the watchlist field to false for the specified stock
    const result = await collection.updateOne(
      { "stocks.ticker": ticker },
      { $set: { "stocks.$.watchlist": false } }
    );
    
    if (result.modifiedCount === 1) {
        res.status(200).send({ success: true, message: 'Stock removed from favorites' });
    } else {
        res.status(500).send('Failed to remove stock from favorites');
    }
} catch (error) {
    console.error('Error removing stock from favorites', error);
    res.status(500).send(error.message);
}
});

// app.get('/favorites/delete/:ticker', async (req, res) => {
//   const ticker = req.params.ticker;
//   if (!db) {
//     return res.status(500).send('MongoDB not connected');
// }

// try {
//     const collection = db.collection('favorites');
    
//     // Here we are assuming you want to actually remove the stock from the array
//     // If you just want to mark it as not favorite, you would update the document instead
//     const result = await collection.updateOne(
//         { 'stocks.ticker': ticker },
//         { $pull: { stocks: { ticker: ticker } } } // This removes the item from the array
//     );

//     if (result.modifiedCount === 1) {
//         res.status(200).send('Stock successfully deleted from portfolio');
//     } else {
//         res.status(404).send('Stock not found in portfolio');
//     }
//   } catch (error) {
//       console.error('Error deleting stock from portfolio', error);
//       res.status(500).send('Failed to delete stock from portfolio');
//   }
// });

app.get('/favorites/check/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
    if (!db) {
      return res.status(500).send('MongoDB not connected');
  }

  try {
      const collection = db.collection('favorites');
      
      // Attempt to find a stock in the portfolio with the given ticker
      const stock = await collection.findOne(
          { 'stocks.ticker': ticker },
          { projection: { 'stocks.$': 1 } } // Use the projection to return only the matching stock
      );

      if (stock) {
          // If a stock with the given ticker was found, return its details
          res.status(200).json(stock.stocks[0]);
      } else {
          // If no stock with the given ticker was found, return a not found message
          res.status(200).json();
          // res.status(404).send('Stock not found in portfolio');
      }
  } catch (error) {
      console.error('Error checking stock in portfolio', error);
      res.status(500).send('Failed to check stock in portfolio');
  }
});

app.get('/buy/:ticker/:count/:price', async (req, res) => {
  const { ticker, count, price } = req.params;
  const countToAdd = parseInt(count);
  const pricePerUnit = parseFloat(price);
  const totalCost = countToAdd * pricePerUnit;

  if (!db) {
    return res.status(500).send('MongoDB not connected');
  }

  try {
    const collection = db.collection('favorites');
    // Check if a document with the given ticker already exists in the stocks array
    const portfolio = await collection.findOne({ "stocks.ticker": ticker });

    if (portfolio) {
      // If the ticker exists, update the count and price
      await collection.updateOne(
        { "stocks.ticker": ticker },
        {
          $inc: {
            "stocks.$.count": countToAdd,
            "stocks.$.price": totalCost,
            "balance": -totalCost
          }
        }
      );
      res.status(200).send({ success: true, message: `Updated ${ticker} with count ${countToAdd} and total cost ${totalCost}` });
    } else {
      // If the ticker does not exist, add a new entry to the stocks array and deduct from balance
      await collection.updateOne(
        {},
        {
          $push: {
            stocks: { ticker: ticker, count: countToAdd, price: totalCost }
          },
          $inc: {
            balance: -totalCost
          }
        },
        { upsert: true } // Ensures a document is created if none match the query
      );
      res.status(200).send({ success: true, message: `Added new stock ${ticker} with count ${countToAdd} and total cost ${totalCost}` });
    }
  } catch (error) {
    console.error('Error updating/inserting stock', error);
    res.status(500).send(error.message);
  }
});

app.get('/sell/:ticker/:count/:price/:sellAll', async (req, res) => {
  const { ticker, count, price, sellAll } = req.params;
  const countToAdd = parseInt(count);
  const pricePerUnit = parseFloat(price);
  const totalCost = countToAdd * pricePerUnit;

  if (!db) {
    return res.status(500).send('MongoDB not connected');
  }

  try {
    const collection = db.collection('favorites');
    // Check if a document with the given ticker already exists in the stocks array
    const portfolio = await collection.findOne({ "stocks.ticker": ticker });

    if (portfolio) {
      // If the ticker exists, update the count and price
      if (sellAll != 0) {
        await collection.updateOne(
          { "stocks.ticker": ticker },
          {
            $inc: {
              "stocks.$.count": -countToAdd,
              "stocks.$.price": -totalCost,
              "balance": +totalCost
            }
          }
        );
      } else {
        await collection.updateOne(
          { "stocks.ticker": ticker },
          {
            $inc: {
              "stocks.$.count": -countToAdd,
              "balance": +totalCost
            },
            $set: {
              "stocks.$.price": 0 // This sets the price to 0
            }
          }
        );
      }
      
      res.status(200).send({ success: true, message: `Updated ${ticker} with count ${countToAdd} and total cost ${totalCost}` });
    } else {
      // If the ticker does not exist, add a new entry to the stocks array and deduct from balance
      await collection.updateOne(
        {},
        {
          $push: {
            stocks: { ticker: ticker, count: countToAdd, price: totalCost }
          },
          $inc: {
            balance: -totalCost
          }
        },
        { upsert: true } // Ensures a document is created if none match the query
      );
      res.status(200).send({ success: true, message: `Added new stock ${ticker} with count ${countToAdd} and total cost ${totalCost}` });
    }
  } catch (error) {
    console.error('Error updating/inserting stock', error);
    res.status(500).send(error.message);
  }
});



app.get('/fav_list', async (req, res) => {
  if (!db) {
    return res.status(500).send('MongoDB not connected');
  }

  try {
    // Assuming 'portfolios' is the collection where your data is stored
    const collection = db.collection('favorites');
    // Assuming there's a single document that stores the entire portfolio including watchlist
    const portfolio = await collection.findOne({});
    
    if (portfolio) {
      // If portfolio is found, send the stocks array as the watchlist
      res.status(200).json(portfolio.stocks);
    } else {
      // If no portfolio is found, send an empty array
      res.status(404).json([]);
    }
  } catch (error) {
    console.error('Error retrieving watchlist', error);
    res.status(500).send('Failed to retrieve watchlist');
  }
});

app.get('/balance', async (req, res) => {
  if (!db) {
    return res.status(500).send('MongoDB not connected');
  }

  try {
    // Assuming 'portfolios' is the collection where your data is stored
    const collection = db.collection('favorites');
    // Assuming there's a single document that stores the entire portfolio including watchlist
    const portfolio = await collection.findOne({});
    
    if (portfolio) {
      // If portfolio is found, send the stocks array as the watchlist
      res.status(200).json(portfolio.balance);
    } else {
      // If no portfolio is found, send an empty array
      res.status(404).json([]);
    }
  } catch (error) {
    console.error('Error retrieving watchlist', error);
    res.status(500).send('Failed to retrieve watchlist');
  }
});
app.get('/dangerous/reset', async (req, res) => {
  if (!db) {
    return res.status(500).send('MongoDB not connected');
  }

  try {
    console.log('emptied')
    const collection = db.collection('favorites');

    // Clear the collection by deleting all documents
    await collection.deleteMany({});

    // Proceed to initialize a new portfolio document
    const document = {
      balance: 25000,
      stocks: []
    };

    const result = await collection.insertOne(document);
    if (result.acknowledged && result.insertedId) {
      res.status(200).json({ success: true, document: document });
    } else {
      res.status(500).send('Failed to initialize portfolio');
    }
  } catch (error) {
    console.error('Error initializing portfolio', error);
    res.status(500).send(error.message);
  }
});


