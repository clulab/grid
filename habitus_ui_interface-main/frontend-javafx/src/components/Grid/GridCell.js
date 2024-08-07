import { useDrop } from "react-dnd"
import { api } from "api"

export default function GridCell({ id, colorValue, rowIndex, rowContents, colIndex, onChange, onDrop, activateCell, isActive }) {

  const gradientArray = ['#e7ebee', '#cce6fe', '#98bde5', '#6c9acc', '#508acc', '#337acc', '#0069cc', '#0069cc', '#0d62c2', '#145bb8', '#1854ae', '#1a4ca4', '#2258c2', '#234fb6', '#2247aa', '#213f9f', '#203793', '#1e2f88', '#1b277d', '#182071', '#151867', '#11115c', '#0f1159', '#0c1057', '#0a0f54', '#080f51', '#060e4e', '#040e4c', '#030d49', '#020c46', '#010b43', '#010941', '#01083e', '#01063b', '#020439', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236']

  let ix = Math.ceil(colorValue * 100)

  const [{ isOver }, dropRef] = useDrop({
    accept: 'sentence',
    drop: (item) => {
      api.dragSentence(colIndex, item.ix) // TODO: How to get sentence index
        .then(([clickedSentences, grid, colNames]) => {
          onDrop(clickedSentences, grid, colNames)
        })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && rowContents[rowIndex].includes(monitor.getItem().text)
    })
  })

  return (
    <td
      ref={dropRef}
      style={{
        width: "4em",
        height: "55px",
        borderRadius: 3,
        cursor: "pointer",
        background: gradientArray[ix],
        border: isActive ? '2px solid #BE1C06' : `2px solid ${gradientArray[ix]}`
      }}
      onClick={(event) => {
        window.alert("Clicked on " + colIndex);
        api.clickCell(rowIndex, colIndex)
          .then(([clickedSentences]) => {
            onChange(clickedSentences);
            activateCell(id);
          })
      }}
    >
      {isOver && "Drop"}
    </td>
  )
}