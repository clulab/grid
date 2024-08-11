import { api } from "api"

import { useDrop } from "react-dnd"

export function GridCell({rowIndex, colIndex, cellContents, rowContents, colorValue, onChange, onDrop, activateCell, isActive}) {
  const gradientArray = [
    '#e7ebee', '#cce6fe', '#98bde5', '#6c9acc', '#508acc', '#337acc', '#0069cc', '#0069cc', '#0d62c2', '#145bb8',
    '#1854ae', '#1a4ca4', '#2258c2', '#234fb6', '#2247aa', '#213f9f', '#203793', '#1e2f88', '#1b277d', '#182071',
    '#151867', '#11115c', '#0f1159', '#0c1057', '#0a0f54', '#080f51', '#060e4e', '#040e4c', '#030d49', '#020c46',
    '#010b43', '#010941', '#01083e', '#01063b', '#020439', 
                                                           '#020236', '#020236', '#020236', '#020236', '#020236',
    '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236',
    '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236',
    '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236',
    '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236',
    '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236',
    '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236',
    '#020236', '#020236', '#020236', '#020236', '#020236', '#020236', '#020236'
  ];
  const color = gradientArray[Math.ceil(colorValue * 100)];

  const [{ isOver }, dropRef] = useDrop({
    accept: 'sentence',
    drop: (item) => {
      api.dragSentence(colIndex, item.sentence.index)
        .then(([grid, clickedSentences, cellContents]) => {
          onDrop(grid, clickedSentences, cellContents)
        })
    },
    canDrop: (item) => {
      const sentenceIndex = item.sentence.index;  
      const inCellContents = cellContents.includes(sentenceIndex);
      const inRowContents = rowContents.includes(sentenceIndex);
  
      return !inCellContents && inRowContents; 
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
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
        background: color,
        border: isActive ? '2px solid #BE1C06' : `2px solid ${color}`
      }}
      onClick={(event) => {
        api.clickCell(rowIndex, colIndex)
          .then(([clickedSentences]) => {
            onChange(clickedSentences);
            activateCell(rowIndex, colIndex);
          })
      }}
    >
      {isOver && "Drop"}
    </td>
  )
}