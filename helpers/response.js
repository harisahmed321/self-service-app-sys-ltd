const success = (data, message) => {
   let ResponseFormat = {
      status : 1,
      message : message,
      response : data
   }
   return ResponseFormat;
}

const failure = (message) => {
   let ResponseFormat = {
      status : 0,
      message : message,
      response : ""
   }
   return ResponseFormat;
}


module.exports = { success, failure }
