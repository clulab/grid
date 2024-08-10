import { Footer }  from "./Footer";
import { GridRow } from "./GridRow";
import { Sentences } from "./Sentences";

import { api } from "api";
import { Button, Input, Loading, } from "components";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./styles.css";

export function Grid() {
  const [grid, setGrid] = useState({});
  const [rowNames, setRowNames] = useState([]);
  const [colNames, setColNames] = useState([]);
  const [clickedSentences, setClickedSentences] = useState([]);
  const [frozenColumns, setFrozenColumns] = useState([]);
  const [rowContents, setRowContents] = useState({});
  const [activeCell, setActiveCell] = useState([]);

  const [editColName, setEditColName] = useState(false);
  const [context, setContext] = useState([]);
  const [copying, setCopying] = useState(false);
  const [waiting, setWaiting] = useState(false);

  function activateCell(rowIndex, colIndex) {
    setActiveCell([rowIndex, colIndex]);
  }

  function saveGrid([grid, rowNames, colNames, clickedSentences, frozenColumns, rowContents, rowIndex, colIndex]) {
    setGrid(grid);
    setRowNames(rowNames);
    setColNames(colNames);
    setClickedSentences(clickedSentences);
    setFrozenColumns(frozenColumns);
    setRowContents(rowContents);
    activateCell(rowIndex, colIndex);
  }

  function handleCopyButtonClicked(event) {
    event.preventDefault();
    api.togMode()
      .then(([copyOn]) => {
        setCopying(copyOn);
      })
  }

  function handleRegenerateButtonClicked(event) {
    event.preventDefault();
    setWaiting(true)
    api.newGrid()
      .then(([grid, rowNames, colNames, clickedSentences, frozenColumns]) => {
        setGrid(grid);
        setRowNames(rowNames);
        setColNames(colNames);
        setClickedSentences(clickedSentences);
        setFrozenColumns(frozenColumns);
        setWaiting(false);
      });
  }

  function handleNewColumnEnter(event) {
    const colQuery = event.target.value.trim()
    if (event.key === "Enter" && colQuery.length > 0) {
      api.addColumn(colQuery)
        .then(([grid, rowNames, colNames, clickedSentences, frozenColumns, rowIndex, colIndex]) => {
          setGrid(grid);
          setRowNames(rowNames);
          setColNames(colNames);         
          setClickedSentences(clickedSentences);
          setFrozenColumns(frozenColumns);
          // Is rowContents not changed here?
          setActiveCell([rowIndex, colIndex]);
          event.target.value = '';
          event.target.blur();
        })
    }
  }

  function handleSetKEnter(event) {
    const kStr = event.target.value.trim();
    const k = parseInt(kStr);
    if (event.key === "Enter" && !isNaN(k)) {
      api.setK(k)
      .then(() => {
        event.target.blur();
      })
    }
  }

  useEffect(() => {
    setWaiting(true);
    api.getGrid()
      .then((gridStructure) => {
        saveGrid(gridStructure);
        setWaiting(false);
      });
  }, [])

  const gridRowsAux = grid && grid.length > 0 && grid.map((gridRow, rowIndex) =>
    <GridRow
      key={"row-" + rowIndex.toString()}
      rowIndex={rowIndex}
      rowContents={rowContents[rowIndex]}
      gridRow={gridRow}
      onChange={
        (clickedSentences) => {
          setClickedSentences(clickedSentences);
          setContext([])
        }
      }
      onDrop={
        (clickedSentences, grid, colNames) => {
          setClickedSentences(clickedSentences);
          setGrid(grid);
          setColNames(colNames);
          setContext([])
        }
      }
      activateCell={activateCell}
      activeCell={activeCell}
    />
  )

  const footer = colNames && colNames.length > 0 && colNames.map((colName, colIndex) =>
    <Footer
      key={"footer-" + colIndex.toString()}
      colIndex={colIndex}
      colName={colName}
      frozenColumns={frozenColumns}
      onFooter={(grid, colNames, frozenColumns) => {
        setGrid(grid);
        setColNames(colNames);
        setFrozenColumns(frozenColumns);
      }}
      onDeleteFrozen={(clickedSentences, grid, colNames, frozenColumns, rowIndex, colIndex) => {
        setClickedSentences(clickedSentences);
        setGrid(grid);
        setColNames(colNames);
        setFrozenColumns(frozenColumns);
        activateCell([rowIndex, colIndex]);
      }}
      editColName={editColName}
      setEditColName={setEditColName}
    />
  );

  return (
    waiting ? <Loading /> : (
      <DndProvider backend={HTML5Backend}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          margin: '20px', 
          borderBottom: clickedSentences && clickedSentences.length > 0 ? '1px solid #DDDDDD' : 'none'
        }}>
          <table style={
            {
              tableLayout: "fixed",
              color: '#2c2c2c',
              fontSize: 14
            }
          }>
            <tbody>
              {gridRowsAux}
              {footer &&
                <tr>
                  <td />{footer}
                </tr>
              }
            </tbody>

          </table>

          <div style={{ gap: 5, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', maxWidth: '220px' }}>

            <Input 
              placeholder="Create new column"
              onKeyPress={handleNewColumnEnter}
            />

            <Input
              placeholder="Max. Columns"
              onKeyPress={handleSetKEnter}
            />

            <Button
              label="Update Grid"
              color="green"
              icon="ci:arrow-reload-02"
              onClick={handleRegenerateButtonClicked}
            />

            <Button
              label={copying ? "Copying" : "Moving"}
              color="blue"
              icon={copying ? "icon-park-solid:bring-to-front-one" : "icon-park-solid:bring-to-front"}
              onClick={handleCopyButtonClicked}
            />
          </div>
        </div>
        <Sentences
          corpus={clickedSentences}
          context={context}
          onChangeContext={(text) => {
            setContext(text);
          }}
        />
      </DndProvider>
    )
  )
}
