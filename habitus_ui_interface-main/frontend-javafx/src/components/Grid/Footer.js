import { api } from "api"

import { Icon } from "@iconify/react"
import { useState } from "react"

export function Footer({ colIndex, colName, frozenColumns, isCalculated, onFooter, onDeleteFrozen, editColIndex, setEditColIndex }) {
  const [showButtons, setShowButtons] = useState(false)
  const [hoverEdit, setHoverEdit] = useState(false)
  const [hoverDelete, setHoverDelete] = useState(false)

  return (
    <td>
      <div
        style={{
          color: isCalculated ? '#616160' : (frozenColumns.includes(colIndex) ? '#2c2c2c' : "#4767AC"),
          textAlign: "center",
          width: "6em",
          marginTop: 5,
          padding: 5,
          minHeight: 80,
          cursor: isCalculated ? 'default' : 'pointer'
        }}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div>
          {editColIndex === colIndex ?
            <input
              placeholder={colName}
              className="footer"
              style={{ '--placeholder-color': 'gray' }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  api.modColumn(colIndex, event.target.value)
                    .then(([grid, colNames, frozenColumns]) => {
                      onFooter(grid, colNames, frozenColumns);
                      setEditColIndex(-1);
                      event.target.value = ''
                      event.target.blur()
                    })
                }
              }}
            />
            :
            colName
          }
        </div>
        {!isCalculated && showButtons && (
          <div style={{ marginTop: 10, gap: 5, display: 'flex', justifyContent: 'center', }}>
            <Icon
              icon="akar-icons:edit"
              width="20" height="20"
              color={hoverEdit ? "#2c2c2c" : "#616160"}
              onClick={() => {
                if (editColIndex === colIndex) setEditColIndex(-1)
                else setEditColIndex(colIndex)
              }}
              onMouseEnter={() => setHoverEdit(true)}
              onMouseLeave={() => setHoverEdit(false)}
            />
            {frozenColumns.includes(colIndex) &&
              <Icon
                icon="octicon:trash-16"
                width="19" height="20"
                color={hoverDelete ? "#DC3545" : "#616160"}
                onClick={(event) => {
                  api.delColumn(colIndex)
                    .then(([grid, rowNames, colNames, clickedSentences, frozenColumns, rowIndex, colIndex]) => {
                      onDeleteFrozen(clickedSentences, grid, colNames, frozenColumns, rowIndex, colIndex)
                    })
                }}
                onMouseEnter={() => setHoverDelete(true)}
                onMouseLeave={() => setHoverDelete(false)}
              />
            }
          </div>
        )}
      </div>
    </td>
  )

}
