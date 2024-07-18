const apiUrl = 'http://127.0.0.1:8000';

const fetchFromApi = async (path, rethrow) => {
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
    if (rethrow)
      throw error;
  }
};

const fetchFromApiWithoutError = async (path) => {
  return fetchFromApi(path, true); // TODO: should probably always re-throw
}

const fetchFromApiWithError = async (path) => {
  return fetchFromApi(path, true)
};

export const api = {
  getBackendReady: async function() {
    const json = await fetchFromApiWithError("/backend-ready");
    const message = json.message;

    return [message];
  },
  getClick: async function(rowName, colName) {
    const query = toQuery([["row", rowName], ["col", colName]]);
    const json = await fetchFromApiWithoutError(`/click/${query}`);
    const clickedSentences = json.clicked_sentences

    return [clickedSentences];
  },
  getCopyToggle: async function() {
    const json = await fetchFromApiWithoutError(`/copyToggle/`);
    const copyOn = json;

    return [copyOn];
  },
  getData: async function() {
    const json = await fetchFromApiWithoutError('/data/');
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;
    const rowContents = json.row_contents;
    const filename = json.filename;
    const anchor = json.anchor;

    return [clickedSentences, grid, colNames, frozenColumns, rowContents, filename, anchor];
  },
  getDeleteFrozenColumn: async function(id) {
    const query = toQuery([["id", id]]);
    const json = await fetchFromApiWithoutError(`/deleteFrozenColumn/${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;

    return [clickedSentences, grid, colNames, frozenColumns];
  },
  getDrag: async function(rowName, colName, text) {
    const query = toQuery([["row", rowName], ["col", colName], ["sent", text]]);
    const json = await fetchFromApiWithoutError(`/drag/${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;

    return [clickedSentences, grid, colNames];
  },
  getEditName: async function(id, name) {
    const query = toQuery([["id", id], ["name", name]]);
    const json = await fetchFromApiWithoutError(`/editName/${query}`);
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;
    
    return [grid, colNames, frozenColumns];
  },
  getRegenerate: async function() {
    const json = await fetchFromApiWithoutError(`/regenerate/`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;

    return [clickedSentences, grid, colNames, frozenColumns];
  },
  getSentenceClick: async function(text) {
    const query = toQuery([["text", text]]);
    const json = await fetchFromApiWithoutError(`/sentenceClick/${query}`);
    const newText = json;

    return [newText];
  },
  getSetK: async function(k) {
    const query = toQuery([["k", k]]);
    const json = await fetchFromApiWithoutError(`/setK/${query}`);

    return [];
  },
  getTextInput: async function(text) {
    const query = toQuery([["text", text]]);
    const json = await fetchFromApiWithoutError(`/textInput/${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozenColumns;

    return [clickedSentences, grid, colNames, frozenColumns];
  }
}

export function toHex(string) {
  var array = [];
  for (var i = 0; i < string.length; i++)
    array[i] = ("000" + string.charCodeAt(i).toString(16)).slice(-4);
  return array.join("");
}

// This should be an array of arrays of two.
// The two are name and values.
export function toQuery(namesAndValues) {
  const urlSearchParams = new URLSearchParams();
  namesAndValues.forEach(nameAndValue => urlSearchParams.append(nameAndValue[0], nameAndValue[1]));
  const query = "?" + urlSearchParams.toString();
  console.info("Query is " + query);
  return query;
}
