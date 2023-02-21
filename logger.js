const log = console.log;
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { v4:uuid } = require('uuid');
const log_events = async (message, file_name) => {
    file_name += '.log';
    const log_date = format(new Date(), 'yyyMMdd\tHH:mm:ss');
    const log_item = `${log_date}\t${uuid()}\t${message}\n`;
    log(log_item);
    try {
        let dir_path = path.join(__dirname, 'logs');
        let file_path = path.join(__dirname, 'logs', file_name);
        if (!fs.existsSync(dir_path)) {
            log('File has been written to the /logs/ directory...');
            await fsPromises.mkdir(dir_path);
            await fsPromises.appendFile(file_path, log_item);
        } else {
            await fsPromises.appendFile(file_path, log_item);
        }
    } catch (err) {
        console.error(err);
    }
}
module.exports = log_events;
