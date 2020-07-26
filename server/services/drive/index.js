/**
 * Google Drive service
 * @module server/services/drive
 */

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname + '/token.json');



/**
 * @callback driveResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {google.drive_v3} drive Google Drive instance
 */

/**
 * Connects to Google Drive
 * @param {driveResultCallback} callback Callback
 */
function connect(callback) {
  // Load client secrets from a local file.
  fs.readFile(path.join(__dirname + '/credentials.json'), (err, content) => {
    if (err) {
      callback(err);
    }
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), (auth) => callback(null, google.drive({ version: 'v3', auth })));
  });
}

/**
 * @callback oAuthResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {google.auth.OAuth2} oAuth2Client OAuth2 instance
 */

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {oAuthResultCallback} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {oAuthResultCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error('Error retrieving access token', err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Finds a proper Mime type according to the file name
 * @param {String} filename File name
 * @returns {String} mime type
 */
function getMime(filename) {
  const extension = filename.substring(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "png":
      return "image/png"
    case "jpg":
    case "jpeg":
      return "image/png"
    case "mp3":
      return "audio/mp3";
    default:
      return "application/octet-stream";
  }
}

/**
 * @callback fileResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {String} id File id
 */

/**
 * Uploads a file from the disk using it's path to Google Drive
 * @param {String} path File path 
 * @param {fileResultCallback} callback Callback
 */
function upload(path, callback) {
  connect((err, drive) => {
    if (err) {
      callback(err);
    } else {
      const filename = path.substring(path.lastIndexOf("/") + 1);
      drive.files.create({
        resource: { 'name': filename },
        media: { mimeType: getMime(filename), body: fs.createReadStream(path) },
        fields: 'id'
      }, (err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, res.data.id);
        }
      });
    }
  });
}

/**
 * @callback onlyErrorCallback
 * @param {Error} error Any error occurred during execution
 */

/**
 * Gets a file from Google Drive and pipes it's data using an streameable object (most likely an Express response object)
 * @param {String} id File ID
 * @param {Object} stream Streameable object
 * @param {onlyErrorCallback} callback Callback
 */
function get(id, stream, callback) {
  connect((err, drive) => {
    if (err) {
      callback(err);
    } else {
      drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' }, (err, res) => {
        if (err) {
          return callback(err);
        }
        res.data
          .on('end', () => {
            callback(null)
          })
          .on('error', err => {
            callback(err);
          })
          .pipe(stream);
      })
    }
  })
}

/**
 * Removes a file from Google Drive using it's ID
 * @param {String} id File id
 * @param {onlyErrorCallback} callback Callback
 */
function remove(id, callback = () => { }) {
  connect((err, drive) => {
    if (err) {
      callback(err);
    } else {
      drive.files.delete({ fileId: id })
        .then(() => callback(null))
        .catch(error => callback(error))
    }
  })
}

module.exports = {
  upload,
  get,
  remove
};