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
  data = data.trim();
  if (!data.startsWith('[')) { data = '[' + data + '\n]'; }
  data = data.replace(/\s+(?=\n)/g, '');
  data = data.replace(/(\})(\n\s*\{)/g, '$1,$2');

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


export default rr;
