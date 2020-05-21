const AttachmentModel = require('../models/attachment.model');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { logger } = require('../helpers/logger');

create = (req) => {
  try {
    const { userId, requestId, fileName, fileType, baseString, requestType } = req;
    const uuidFileName = `${uuidv4()}.${fileType}`;
    
    const attachment = new AttachmentModel({
      userId,
      requestId,
      uuidFileName,
      fileName,
      fileType,
      requestType
    });

    fs.writeFile(
      `./uploads/${uuidFileName}`,
      baseString,
      { encoding: 'base64' },
      (error) => {
        if (error) {
          console.log(error);
          logger.error(`[Controller] Attachment [Message] ${error}`);
          return;
        }
        attachment
          .save()
          .then()
          .catch((err) =>
            logger.error(`[Controller] Attachment [Message] ${err}`)
          );
        console.log('File created');
      }
    );
  } catch (error) {
    logger.error(`[Controller] Attachment [Message] ${error}`);
  }
};

module.exports = { create };
