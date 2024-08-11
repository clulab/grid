const apiUrl = 'http://127.0.0.1:8001';

async function fetchForApi(path) {
  const url = `${apiUrl}${path}`;
  console.log(url);

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`${response.status} - ${response.statusText}`);

    const result = await response.json();
    console.log(result);
    return result;
  }
  catch (error) {
    console.log('error fetching ->', error);
    throw error;
  }
};

// This should be an array of arrays of two.
// The two are name and values.
function toQuery(namesAndValues) {
  const urlSearchParams = new URLSearchParams();
  namesAndValues.forEach(nameAndValue => urlSearchParams.append(nameAndValue[0], nameAndValue[1]));
  const query = "?" + urlSearchParams.toString();
  return query;
}

function destructureGrid(json) {
  const grid = json.grid;
  const rowInfo = json.rowInfo;
  const colNames = json.colNames;
  const clickedSentences = json.clickedSentences;
  const frozenColumns = json.frozenColumns;
  const cellContents = json.cellContents;
  const rowIndexString = json.rowIndex || "-1";
  const colIndexString = json.colIndex || "-1";
  const rowIndex = parseInt(rowIndexString);
  const colIndex = parseInt(colIndexString);

  return [grid, rowInfo, colNames, clickedSentences, frozenColumns, cellContents, rowIndex, colIndex];
}

export const api = {
  getReady: async function() {
    const json = await fetchForApi("/getReady");
    const message = json.message;

    return [message];
  },

  getGrid: async function() {
    const json = await fetchForApi('/getGrid');

    return destructureGrid(json);
  },
  newGrid: async function() {
    const json = await fetchForApi(`/newGrid`);
    const [grid, rowInfo, colNames, clickedSentences, frozenColumns, , , ] = destructureGrid(json)

    return [grid, rowInfo, colNames, clickedSentences, frozenColumns];
  },

  clickCell: async function(rowIndex, colIndex) {
    const query = toQuery([["rowIndex", rowIndex], ["colIndex", colIndex]]);
    const json = await fetchForApi(`/clickCell${query}`);
    const clickedSentences = json

    return [clickedSentences];
  },
  clickSentence: async function(sentenceIndex) {
    const query = toQuery([["sentenceIndex", sentenceIndex]]);
    const json = await fetchForApi(`/clickSentence${query}`);
    const [preContext, text, postContext] = json;

    return [preContext, text, postContext];
  },
  dragSentence: async function(colIndex, sentenceIndex) {
    const query = toQuery([["colIndex", colIndex], ["sentenceIndex", sentenceIndex]]);
    const json = await fetchForApi(`/dragSentence${query}`);
    const [grid, , , clickedSentences, , cellContents , , ] = destructureGrid(json)

    return [grid, clickedSentences, cellContents];
  },

  addColumn: async function(colQuery) {
    const query = toQuery([["colQuery", colQuery]]);
    const json = await fetchForApi(`/addColumn${query}`);
    
    return destructureGrid(json);
  },
  modColumn: async function(colIndex, name) {
    const query = toQuery([["colIndex", colIndex], ["colName", name]]);
    const json = await fetchForApi(`/modColumn${query}`);
    const [grid, , colNames, , frozenColumns, , , ] = destructureGrid(json)
    return [grid, colNames, frozenColumns];
  },
  delColumn: async function(colIndex) {
    const query = toQuery([["colIndex", colIndex]]);
    const json = await fetchForApi(`/delColumn${query}`);

    return destructureGrid(json);
  },


  setK: async function(k) {
    const query = toQuery([["k", k.toString()]]);
    /*const json =*/ await fetchForApi(`/setK${query}`);

    return [];
  },

  togMode: async function() {
    const json = await fetchForApi(`/togMode`);
    const copyOn = json;

    return [copyOn];
  }
}
