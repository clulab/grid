const apiUrl = 'http://127.0.0.1:8001';

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
  getClick: async function(rowIndex, colIndex) {
    const query = toQuery([["rowIndex", rowIndex], ["colIndex", colIndex]]);
    const json = await fetchFromApi(`/click${query}`);
    const clickedSentences = json

    return [clickedSentences];
  },
  getCopyToggle: async function() {
    const json = await fetchFromApi(`/copyToggle`);
    const copyOn = json;

    return [copyOn];
  },
  getData: async function() {
    const json = await fetchFromApi('/data');
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;
    const rowContents = json.row_contents;

    const rowIndexString = json.row_index || "-1";
    const colIndexString = json.col_index || "-1";
    const rowIndex = parseInt(rowIndexString);
    const colIndex = parseInt(colIndexString);

    return [clickedSentences, grid, colNames, frozenColumns, rowContents, rowIndex, colIndex];
  },
  getDeleteFrozenColumn: async function(colIndex) {
    const query = toQuery([["colIndex", colIndex]]);
    const json = await fetchFromApi(`/deleteFrozenColumn${query}`);
    const newRowIndex = json.row_index;
    const newColIndex = json.col_index;
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;

    return [clickedSentences, grid, colNames, frozenColumns, newRowIndex, newColIndex];
  },
  getDrag: async function(colIndex, sentenceIndex) {
    const query = toQuery([["colIndex", colIndex], ["sentenceIndex", sentenceIndex]]);
    const json = await fetchFromApi(`/drag${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;

    return [clickedSentences, grid, colNames];
  },
  getEditName: async function(colIndex, name) {
    const query = toQuery([["colIndex", colIndex], ["name", name]]);
    const json = await fetchFromApi(`/editName${query}`);
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;
    
    return [grid, colNames, frozenColumns];
  },
  getRegenerate: async function() {
    const json = await fetchFromApi(`/regenerate`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;

    return [clickedSentences, grid, colNames, frozenColumns];
  },
  getSentenceClick: async function(sentenceIndex) {
    const query = toQuery([["sentence_index", sentenceIndex]]);
    const json = await fetchFromApi(`/sentenceClick${query}`);
    const newText = json;

    return [newText];
  },
  getSetK: async function(k) {
    const query = toQuery([["k", k.toString()]]);
    /*const json =*/ await fetchFromApi(`/setK${query}`);

    return [];
  },
  getTextInput: async function(colQuery) {
    const query = toQuery([["colQuery", colQuery]]);
    const json = await fetchFromApi(`/textInput${query}`);
    const clickedSentences = json.clicked_sentences;
    const grid = json.grid;
    const colNames = json.col_names;
    const frozenColumns = json.frozen_columns;

    return [clickedSentences, grid, colNames, frozenColumns];
  }
}

// This should be an array of arrays of two.
// The two are name and values.
export function toQuery(namesAndValues) {
  const urlSearchParams = new URLSearchParams();
  namesAndValues.forEach(nameAndValue => urlSearchParams.append(nameAndValue[0], nameAndValue[1]));
  const query = "?" + urlSearchParams.toString();
  return query;
}
