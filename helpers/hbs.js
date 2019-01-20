const moment = require('moment');

module.exports = {
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  threeQuotes: function(quote, len) {
    let threeQuotes = [];
    const peopleArray = Object.keys(quote).map(i => quote[i]);
    for (i = 0; i < 3; i++) {
      let rand = Math.floor(Math.random() * peopleArray.length);
      threeQuotes.push(peopleArray[rand]);
    }

    return threeQuotes;
  }
};
