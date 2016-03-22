/**
 * koa-body-diy - index.js
 * @author  Liuanto
 */

'use strict';

var buddy = require('co-body');

module.exports = resbody;

function resbody(opts) {
  opts = opts || {};
  opts.patchNode = 'patchNode' in opts ? opts.patchNode : false;
  opts.patchKoa  = 'patchKoa'  in opts ? opts.patchKoa  : true;
  opts.encoding  = 'encoding'  in opts ? opts.encoding  : 'utf-8';
  opts.jsonLimit = 'jsonLimit' in opts ? opts.jsonLimit : '1mb';
  opts.formLimit = 'formLimit' in opts ? opts.formLimit : '56kb';
  opts.qs = 'qs' in opts ? opts.qs : {};
  opts.textLimit = 'textLimit' in opts ? opts.textLimit : '56kb';
  opts.strict = 'strict' in opts ? opts.strict : true;

  return function *(next){
    var body = {};
    // so don't parse the body in strict mode
    if (!opts.strict || ["GET", "HEAD", "DELETE"].indexOf(this.method.toUpperCase()) === -1) {
      if (this.is('json'))  {
        body = yield buddy.json(this, {encoding: opts.encoding, limit: opts.jsonLimit});
      }
      else if (this.is('urlencoded')) {
        body = yield buddy.form(this, {encoding: opts.encoding, limit: opts.formLimit, queryString: opts.qs});
      }
      else if (this.is('text')) {
        body = yield buddy.text(this, {encoding: opts.encoding, limit: opts.textLimit});
      }
    }

    if (opts.patchNode) {
      this.req.body = body;
    }
    if (opts.patchKoa) {
      this.request.body = body;
    }
    yield next;
  };
}
