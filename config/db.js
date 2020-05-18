const mongoose = require('mongoose');

mongoose
  .connect(
    `${process.env.DB_HOST_PRE}${
      process.env.DB_USER && process.env.DB_PASS
        ? process.env.DB_USER + ':' + process.env.DB_PASS + '@'
        : ''
    }${process.env.DB_HOST}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log(
      'mongodb connected',
      `${process.env.DB_HOST_PRE}${
        process.env.DB_USER && process.env.DB_PASS
          ? process.env.DB_USER + ':' + process.env.DB_PASS + '@'
          : ''
      }${process.env.DB_HOST}/${process.env.DB_NAME}`
    );
  })
  .catch(() => {
    console.log('mongodb not connected');
  });

// module.exports = db;
