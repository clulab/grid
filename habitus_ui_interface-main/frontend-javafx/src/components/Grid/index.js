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
  const noContext = [null, null, null];

  const [grid, setGrid] = useState({});
  const [rowInfo, setRowInfo] = useState([]);
  const [colNames, setColNames] = useState([]);
  const [clickedSentences, setClickedSentences] = useState([]);
  const [frozenColumns, setFrozenColumns] = useState([]);
  const [cellContents, setCellContents] = useState({});
  const [activeCell, setActiveCell] = useState([]);

  const [editColIndex, setEditColIndex] = useState(-1);
  const [context, setContext] = useState(noContext);
  const [copying, setCopying] = useState(false);
  const [waiting, setWaiting] = useState(false);

  function resetContext() {
    setContext(noContext);
  }

  function activateCell(rowIndex, colIndex) {
    setActiveCell([rowIndex, colIndex]);
  }

  function saveGrid([grid, rowInfo, colNames, clickedSentences, frozenColumns, cellContents, rowIndex, colIndex]) {
    setGrid(grid);
    setRowInfo(rowInfo);
    setColNames(colNames);
    setClickedSentences(clickedSentences);
    setFrozenColumns(frozenColumns);
    setCellContents(cellContents);
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
      .then(([grid, rowInfo, colNames, clickedSentences, frozenColumns]) => {
        setGrid(grid);
        setRowInfo(rowInfo);
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
        .then((gridStructure) => {
          saveGrid(gridStructure);
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
      rowInfo={rowInfo[rowIndex]}
      gridRow={gridRow}
      rowContents={cellContents[rowIndex]}
      onChange={
        (clickedSentences) => {
          setClickedSentences(clickedSentences);
          resetContext();
        }
      }
      onDrop={
        (grid, clickedSentences, cellContents) => {
          setGrid(grid);
          setClickedSentences(clickedSentences);
          setCellContents(cellContents);
          resetContext();
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
      isCalculated={colIndex === colNames.length - 1 || colIndex === colNames.length - 2}
      onFooter={(grid, colNames, frozenColumns) => {
        setGrid(grid);
        setColNames(colNames);
        setFrozenColumns(frozenColumns);
      }}
      onDeleteFrozen={(gridStructure) => {
        saveGrid(gridStructure);
      }}
      editColIndex={editColIndex}
      setEditColIndex={setEditColIndex}
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
          clickedSentences={clickedSentences}
          context={context}
          onChangeContext={(preContext, text, postContext) => {
            setContext([preContext, text, postContext]);
          }}
        />
      </DndProvider>
    )
  )
}
