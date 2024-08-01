import { useState } from "react"
import { Icon } from "@iconify/react"
import { api } from "api"

export default function Footer({ id, colName, frozenColumns, onFooter, onDeleteFrozen, editColName, setEditColName }) {
  const [showButtons, setShowButtons] = useState(false)
  const [hoverEdit, setHoverEdit] = useState(false)
  const [hoverDelete, setHoverDelete] = useState(false)

  return (
    <td key={id}>
      <div style={{
        color: colName.includes('unassigned') || colName.includes('all') ? '#616160' : (frozenColumns.includes(id) ? '#2c2c2c' : "#4767AC"),
        textAlign: "center",
        width: "6em",
        marginTop: 5,
        padding: 5,
        minHeight: 80,
        cursor: colName.includes('unassigned') || colName.includes('all') ? 'default' : 'pointer'
      }}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div>
          {editColName === id ?
            <input
              placeholder={colName}
              className="footer"
              style={{ '--placeholder-color': 'gray' }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  api.getEditName(id, event.target.value)
                    .then(([grid, col_names, frozen_columns]) => {
                      onFooter(grid, col_names, frozen_columns);
                      setEditColName('');
                      event.target.value = ''
                      event.target.blur()
                    })
                }
              }}
            /> : colName}
        </div>
        {!colName.includes('unassigned') && !colName.includes('all') && showButtons && (
          <div style={{ marginTop: 10, gap: 5, display: 'flex', justifyContent: 'center', }}>
            <Icon
              icon="akar-icons:edit"
              width="20" height="20"
              color={hoverEdit ? "#2c2c2c" : "#616160"}
              onClick={() => {
                if (editColName === id) setEditColName('')
                else setEditColName(id)
              }}
              onMouseEnter={() => setHoverEdit(true)}
              onMouseLeave={() => setHoverEdit(false)}
            />
            {frozenColumns.includes(id) &&
              <Icon
                icon="octicon:trash-16"
                width="19" height="20"
                color={hoverDelete ? "#DC3545" : "#616160"}
                onClick={(event) => {
                  api.getDeleteFrozenColumn(id)
                    .then(([clicked_sentences, grid, col_names, frozen_columns]) => {
                      onDeleteFrozen(clicked_sentences, grid, col_names, frozen_columns)
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
