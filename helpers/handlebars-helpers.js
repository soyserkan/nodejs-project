const moment = require('moment');

moment.locale('tr');
module.exports = {
    select: (param, options) => options.fn(this).replace(new RegExp('value=\"' + param + '\"'), "$&selected='selected'"),
    generateTime: (date, format) => moment(date).format(format),
    limitString: (string, length) => (string.length > length) ? string.substr(0, length) + '...' : string
};