
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Grid } from 'components';
import { api } from "services"
import './styles.css';

function GridPage() {
  const [filename, setFilename] = useState('');
  const [anchor, setAnchor] = useState('');
  const [waitingFileName, setWaitingFilename] = useState(false)

  // const navigate = useNavigate();

  useEffect(() => {
    setWaitingFilename(true);
    api.getData()
      .then(([clicked_sentences, grid, col_names, frozen_columns, row_contents, filename, anchor]) => {
      // setFilename(data.filename);
      // setAnchor(data.anchor);
      // setWaitingFilename(false);
      });
  }, [])

  return (
    <div>
      <Grid />
    </div >
  );
}

export default GridPage;
