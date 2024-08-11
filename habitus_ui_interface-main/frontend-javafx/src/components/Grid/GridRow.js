import { GridCell } from "./GridCell"

export function GridRow({rowIndex, rowInfo, gridRow, rowContents, onChange, onDrop, activateCell, activeCell}) {
  const cells = gridRow.map((colorValue, colIndex) =>
    <GridCell
      key={"row-" + rowIndex.toString() + " col-" + colIndex.toString()}
      rowIndex={rowIndex}
      colIndex={colIndex}
      cellContents={rowContents[colIndex]}
      rowContents={rowContents[rowContents.length - 1]}
      colorValue={colorValue}
      onChange={onChange}
      onDrop={onDrop}
      activateCell={activateCell}
      isActive={activeCell[0] === rowIndex && activeCell[1] === colIndex}
    />
  )
  const color = rowInfo.color

  return (<tr>
    <td
      className="row-name"
      style={{
        color: color
      }}
    >
      {rowInfo.name}
    </td>
    {cells}
  </tr>)
}
