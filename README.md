# Covid19 API

Developed using Node.js and Express. The data is stored and fetched from a MySQL database.

## Data

- https://www.kaggle.com/sudalairajkumar/novel-corona-virus-2019-dataset?select=covid_19_data.csv

## Endpoint

- _`http://localhost:3000/covid/:country_name/:period`_
  - Example: _`http://localhost:3000/covid/india/072020`_

## Setup and Usage

```bash
# install dependencies
$ npm install
# serve at localhost:3000
$ node server.js
# or
$ nodemon server.js
```
