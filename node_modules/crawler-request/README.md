# crawler-request

**HTTP request module customized for crawlers.**

[![version](https://img.shields.io/npm/v/crawler-request.svg)](https://www.npmjs.org/package/crawler-request)
[![downloads](https://img.shields.io/npm/dt/crawler-request.svg)](https://www.npmjs.org/package/crawler-request)
[![node](https://img.shields.io/node/v/crawler-request.svg)](https://nodejs.org/)
[![status](https://gitlab.com/autokent/crawler-request/badges/master/pipeline.svg)](https://gitlab.com/autokent/crawler-request/pipelines)

## Installation
`npm install crawler-request`

## Usage

### Simple Request
```js
const crawler = require('crawler-request');

crawler("https://stackoverflow.com/").then(function(response){
    // handle response
    console.log(response.text.lenght);
});
```

### PDF Parse
```js
const crawler = require('crawler-request');

crawler("http://careers.stackoverflow.com/stack_overflow_careers.pdf").then(function(response){
    // handle response
    console.log(response.text.lenght);
});
```

### Extend
```js
const crawler = require('crawler-request');

function response_text_size(response){
    response["size"] = response.text.length;
    return response;
}

crawler("https://stackoverflow.com/",response_text_size).then(function(response){
    // handle response
	console.log(response.size);
});
```

## Test
`mocha` or `npm test`

Check [test folder](https://gitlab.com/autokent/crawler-request/tree/master/test) and [quickstart.js](https://gitlab.com/autokent/crawler-request/blob/master/QUICKSTART.js) for extra usages.

## Support
I use this package actively myself, so it has my top priority. You can chat on WhatsApp about any infos, ideas and suggestions.

[![WhatsApp](https://img.shields.io/badge/style-chat-green.svg?style=flat&label=whatsapp)](https://api.whatsapp.com/send?phone=905063042480&text=Hi%2C%0ALet%27s%20talk%20about%20crawler-request)

### Submitting an Issue
If you find a bug or a mistake, you can help by submitting an issue to [GitLab Repository](https://gitlab.com/autokent/crawler-request/issues)

### Creating a Merge Request
GitLab calls it merge request instead of pull request.  

* [A Guide for First-Timers](https://about.gitlab.com/2016/06/16/fearless-contribution-a-guide-for-first-timers/)
* [How to create a merge request](https://docs.gitlab.com/ee/gitlab-basics/add-merge-request.html)
* Check [Contributing Guide](https://gitlab.com/autokent/crawler-request/blob/master/CONTRIBUTING.md) 

## License
[MIT licensed](https://gitlab.com/autokent/crawler-request/blob/master/LICENSE) and all it's dependencies are MIT or BSD licensed.