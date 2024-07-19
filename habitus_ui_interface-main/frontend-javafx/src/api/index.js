const apiUrl = 'http://127.0.0.1:8000';

const fetchFromApi = async (path) => {
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

export const api = {
  getBackendReady: async function() {
    const json = await fetchFromApi("/backend-ready");
    const message = json.message;

    return [message];
  },
  getClick: async function(rowName, colName) {
    const query = toQuery([["row", rowName], ["col", colName]]);
    const json = await fetchFromApi(`/click/${query}`);
    const clickedSentences = json

    return [clickedSentences];
  },
  getCopyToggle: async function() {
    const json = await fetchFromApi(`/copyToggle/`);
    const copyOn = json;

    return [copyOn];
  },
  getData: async function() {
    const json = await fetchFromApi('/data/');
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
    const json = await fetchFromApi(`/deleteFrozenColumn/${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;

    return [clickedSentences, grid, colNames, frozenColumns];
  },
  getDrag: async function(rowName, colName, text) {
    const query = toQuery([["row", rowName], ["col", colName], ["sent", text]]);
    window.alert("calling drag");
    const json = await fetchFromApi(`/drag/${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;

    return [clickedSentences, grid, colNames];
  },
  getEditName: async function(id, name) {
    const query = toQuery([["id", id], ["name", name]]);
    const json = await fetchFromApi(`/editName/${query}`);
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;
    
    return [grid, colNames, frozenColumns];
  },
  getRegenerate: async function() {
    const json = await fetchFromApi(`/regenerate/`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;

    return [clickedSentences, grid, colNames, frozenColumns];
  },
  getSentenceClick: async function(text) {
    const query = toQuery([["text", text]]);
    const json = await fetchFromApi(`/sentenceClick/${query}`);
    const newText = json;

    return [newText];
  },
  getSetK: async function(k) {
    const query = toQuery([["k", k]]);
    /*const json =*/ await fetchFromApi(`/setK/${query}`);

    return [];
  },
  getTextInput: async function(text) {
    const query = toQuery([["text", text]]);
    const json = await fetchFromApi(`/textInput/${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozenColumns;

    return [clickedSentences, grid, colNames, frozenColumns];
  }
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
