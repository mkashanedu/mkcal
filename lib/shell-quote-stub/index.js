function quote(args) {
  return args.map(function(arg) {
    if (typeof arg === 'object') {
      if (arg.op === 'glob') return arg.pattern;
      return '';
    }
    return String(arg).replace(/([^a-zA-Z0-9_\-.,:/\@\+])/g, '\\$1');
  }).join(' ');
}

function parse(s, env) {
  var words = [];
  var word = '';
  var inSingle = false;
  var inDouble = false;
  var i = 0;

  while (i < s.length) {
    var c = s[i];
    if (inSingle) {
      if (c === "'") { inSingle = false; }
      else { word += c; }
    } else if (inDouble) {
      if (c === '"') { inDouble = false; }
      else if (c === '\\' && i + 1 < s.length) {
        i++;
        var nc = s[i];
        if (nc === '"' || nc === '\\' || nc === '$' || nc === '`') word += nc;
        else { word += '\\'; word += nc; }
      } else { word += c; }
    } else {
      if (c === "'") { inSingle = true; }
      else if (c === '"') { inDouble = true; }
      else if (c === '\\' && i + 1 < s.length) { i++; word += s[i]; }
      else if (c === ' ' || c === '\t' || c === '\n') {
        if (word.length) { words.push(word); word = ''; }
      } else { word += c; }
    }
    i++;
  }
  if (word.length) words.push(word);
  return words;
}

module.exports = { quote: quote, parse: parse };
module.exports.default = module.exports;
