require('dotenv').config();

const http = require('http');
const url = require('url');
const { parse } = require('querystring');

const {
    getAllWeatherConditions,
    getWeatherConditionById,
    createWeatherCondition,
    updateWeatherConditionById,
    deleteWeatherConditionById,
  } = require('./weatherdbOperations');
  

const { SERVER_PORT } = process.env;

async function startServer() {
  
    const server = http.createServer((req, res) => {
        const reqUrl = url.parse(req.url, true);

  // Handler for GET /weather
  if (req.method === 'GET' && reqUrl.pathname === '/weather') {
    getAllWeatherConditions()
      .then((weatherConditions) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(weatherConditions));
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        console.error(error);
      });
  }

  // Handler for GET /weather/:id
  else if (req.method === 'GET' && reqUrl.pathname.startsWith('/weather/')) {
    const id = reqUrl.pathname.split('/')[2];
    getWeatherConditionById(id)
      .then((weatherCondition) => {
        if (weatherCondition) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(weatherCondition));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not Found' }));
        }
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        console.error(error);
      });
  }

  // Handler for POST /weather
  else if (req.method === 'POST' && reqUrl.pathname === '/weather') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const weatherConditionData = parse(body);
      createWeatherCondition(weatherConditionData.adjective)
        .then((newWeatherCondition) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newWeatherCondition));
        })
        .catch((error) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          console.error(error);
        });
    });
  }

  //Handler for PUT /weather/:id
  else if (req.method === 'PUT' && reqUrl.pathname.startsWith('/weather/')) {
    const id = reqUrl.pathname.split('/')[2];

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const weatherConditionData = parse(body);
      updateWeatherConditionById(id, weatherConditionData.adjective)
        .then((updatedWeatherCondition) => {
          if (updatedWeatherCondition) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedWeatherCondition));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
          }
        })
        .catch((error) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          console.error(error);
        });
    });
  }

  // Handler for DELETE /weather/:id
  else if (req.method === 'DELETE' && reqUrl.pathname.startsWith('/weather/')) {
    const id = reqUrl.pathname.split('/')[2];
    deleteWeatherConditionById(id)
      .then((deletedWeatherCondition) => {
        if (deletedWeatherCondition) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(deletedWeatherCondition));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not Found' }));
        }
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        console.error(error);
      });
  }

  // If there is no end point for the input request
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

  server.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
}

// Start API server
startServer();