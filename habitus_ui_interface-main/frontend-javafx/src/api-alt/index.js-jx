
function fetchForApi(f) {
  const string = f();
  // window.alert(string);
  const json = JSON.parse(string);
  
  return json;
};

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
    if ("jxgridserver" in window) {
      const json = fetchForApi(function() { return window.jxgridserver.getReady(); });
      const message = json.message;

      return [message];
    }
    else
      return ["The grid is not ready."]
  },

  getGrid: async function() {
    const json = fetchForApi(function() { return window.jxgridserver.getGrid(); });

    return destructureGrid(json);
  },
  newGrid: async function() {
    const json = fetchForApi(function() { return window.jxgridserver.newGrid(); });

    return destructureGrid(json);
  },

  clickCell: async function(rowIndex, colIndex) {
    const json = fetchForApi(function() { return window.jxgridserver.clickCell(rowIndex, colIndex); });
    const clickedSentences = json

    return [clickedSentences];
  },
  clickSentence: async function(sentenceIndex) {
    const json = fetchForApi(function() { return window.jxgridserver.clickSentence(sentenceIndex); });
    const [preContext, text, postContext] = json;

    return [preContext, text, postContext];
  },
  dragSentence: async function(colIndex, sentenceIndex) {
    const json = fetchForApi(function() { return window.jxgridserver.dragSentence(colIndex, sentenceIndex); });
    const [grid, , , clickedSentences, , cellContents , , ] = destructureGrid(json)

    return [grid, clickedSentences, cellContents];
  },

  addColumn: async function(colQuery) {
    const json = fetchForApi(function() { return window.jxgridserver.addColumn(colQuery); });
    
    return destructureGrid(json);
  },
  modColumn: async function(colIndex, colName) {
    const json = fetchForApi(function() { return window.jxgridserver.modColumn(colIndex, colName); });
    const [grid, , colNames, , frozenColumns, , , ] = destructureGrid(json)

    return [grid, colNames, frozenColumns];
  },
  delColumn: async function(colIndex) {
    const json = fetchForApi(function() { return window.jxgridserver.delColumn(colIndex); });

    return destructureGrid(json);
  },


  setK: async function(k) {
    fetchForApi(function() { return window.jxgridserver.setK(k); });

    return [];
  },

  togMode: async function() {
    const json = fetchForApi(function() { return window.jxgridserver.togMode(); });
    const copyOn = json;

    return [copyOn];
  }
}
