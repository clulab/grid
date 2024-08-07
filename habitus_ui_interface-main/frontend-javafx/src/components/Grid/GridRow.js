import GridCell from "./GridCell"

export default function GridRow({ rowName, rowContents, data, onChange, onDrop, activateCell, activeCell }) {

  let cells = Object.entries(data).map(([colIndex, v], ix) => {
      const rowIndex = ix;
      const identifier = rowIndex.toString() + "-" + colIndex.toString();

      <GridCell
        key={identifier}
        id={identifier}
        colorValue={v}
        rowIndex={ix}
        rowContents={rowContents}
        colIndex={colIndex}
        onChange={onChange}
        onDrop={onDrop}
        activateCell={activateCell}
        isActive={activeCell === identifier}
      />
  })

  return (<tr>
    <td className="row-name">
      {rowName}
    </td>
    {cells}
  </tr>)
}