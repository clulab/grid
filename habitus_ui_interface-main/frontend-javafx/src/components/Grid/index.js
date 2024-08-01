import { useState, useEffect } from "react"
import { api } from "api"
import "./styles.css"
import Sentences from "./Sentences"
import { Button, Input, Loading, } from 'components';
import GridRow from "./GridRow"
import Footer from "./Footer"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function Grid() {
  const [activeCell, setActiveCell] = useState()
  const [editColName, setEditColName] = useState(false)
  const [corpus, setCorpus] = useState([]);
  const [context, setContext] = useState([]);
  const [gridRows, setGridRows] = useState({})
  const [colNumToName, setColNumToName] = useState({})
  const [frozenColumns, setFrozenColumns] = useState([])
  const [rowContents, setRowContents] = useState({})
  const [copying, setCopying] = useState(false);
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    setWaiting(true);
    api.getData()
      .then(([clicked_sentences, grid, col_names, frozen_columns, row_contents]) => {
        setCorpus(clicked_sentences);
        setGridRows(grid);
        setColNumToName(col_names);
        setFrozenColumns(frozen_columns);
        setRowContents(row_contents);
        setWaiting(false);
      });
  }, [])

  const handleCopyButtonClicked = (event) => {
    event.preventDefault();
    api.getCopyToggle()
      .then(([copyOn]) => {
        setCopying(copyOn);
      })
  }

  const handleRegenerateButtonClicked = (event) => {
    event.preventDefault();
    setWaiting(true)
    api.getRegenerate()
      .then(([clicked_sentences, grid, col_names, frozen_columns]) => {
        setCorpus(clicked_sentences);
        setGridRows(grid);
        setColNumToName(col_names);
        setFrozenColumns(frozen_columns);
        setWaiting(false);
      });
  }

  const handleNewColumnEnter = (event) => {
    let col_name = event.target.value.trim()
    if (event.key === "Enter" && col_name.length > 0) {
      api.getTextInput(col_name)
        .then(([clicked_sentences, grid, col_names, frozen_columns]) => {
          setCorpus(clicked_sentences);
          setGridRows(grid);
          setColNumToName(col_names);
          setFrozenColumns(frozen_columns)
          event.target.value = '';
          event.target.blur();
        })
    }
  }

  const handleSetKEnter = (event) => {
    if (event.key === "Enter") {
      // TODO: trim it, check for number and range
      const k = event.target.value === '' ? 0 : event.target.value;
      api.getSetK(k);
    }
  }

  const activateCell = (item) => setActiveCell(item)

  let gridRowsAux = gridRows && Object.entries(gridRows).map(([name, cells], ix) =>
    <GridRow
      key={ix}
      rowName={name}
      rowContents={rowContents}
      data={cells}
      onChange={
        (clickedSentences) => {
          setCorpus(clickedSentences);
          setContext([])
        }
      }
      onDrop={
        (clicked_sentences, grid, col_names) => {
          setCorpus(clicked_sentences);
          setGridRows(grid);
          setColNumToName(col_names);
          setContext([])
        }
      }
      activateCell={activateCell}
      activeCell={activeCell}
    />
  )

  // Get the col names from the first row
  // let rowNames = Object.keys(data)
  let rows = Object.values(gridRows)
  let footer = null
  if (rows.length > 0) {
    let row = rows[0]
    // let colIDs = Object.keys(row)
    let colNames = colNumToName
    footer = colNames.map((name, ix) =>
      <Footer
        key={ix}
        id={ix}
        colName={name}
        editColName={editColName}
        setEditColName={setEditColName}
        frozenColumns={frozenColumns}
        onFooter={(grid, col_names, frozen_columns) => {
          setGridRows(grid);
          setColNumToName(col_names);
          setFrozenColumns(frozen_columns);
        }}
        onDeleteFrozen={(clicked_sentences, grid, col_names, frozen_columns) => {
          setCorpus(clicked_sentences);
          setGridRows(grid);
          setColNumToName(col_names);
          setFrozenColumns(frozen_columns);
        }}
      />
    )
  }

  return (
    waiting ? <Loading /> : (
      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', borderBottom: corpus && corpus.length > 0 ? '1px solid #DDDDDD' : 'none' }}>
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
          corpus={corpus}
          context={context}
          onChangeContext={(text) => {
            setContext(text);
          }}
        />
      </DndProvider>
    )
  )
}
