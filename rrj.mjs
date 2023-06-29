// -*- coding: utf-8, tab-width: 2 -*-

import getStdin from 'get-stdin';


const cheapBuiltinNoOp = Boolean;


const rr = async function readRelaxedJsonFromStdin(opt) {
  if (!opt) { return rr(true); }
  const logFunc = (opt.logFunc || cheapBuiltinNoOp);
  logFunc('Reading from stdin:');
  let data = await getStdin();
  logFunc('Done, got %s characters.', data.length);

  logFunc('Decoding…');
  data = rr.cleanup(data);
  logFunc('Parsing…');
  data = JSON.parse(data);
  if (Array.isArray(data) && (data.slice(-1)[0] === null)) { data.pop(); }
  logFunc('Number of top-level records in input:', data.length);

  const effOffset = (+opt.offset || 0);
  let effLimit = (+opt.limit || +opt.defailtLimit);
  if (effOffset || effLimit) {
    data = data.slice(effOffset, effOffset + (effLimit || data.length));
    const nSliced = data.length;
    logFunc('Number of top-level records after slicing:', nSliced);
  }

  data.offset = effOffset;
  return data;
};


Object.assign(rr, {

  cleanup(orig) {
    let j = orig;
    j = j.trim();
    j = j.replace(/^[\w\s\.=\(]+(?=\[|\{)/, '');
    j = j.replace(/[\);]+$/, '');
    j = j.replace(/,\s*(?=\]?$)/, '');
    j = j.trim();
    if (!j.startsWith('[')) { j = '[' + j + '\n]'; }
    j = j.replace(/\s+(?=\n)/g, '');
    j = j.replace(/(\})(\n\s*\{)/g, '$1,$2');
    return j;
  },


});


export default rr;
