
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Grid } from 'components';
import { api } from "api"
import './styles.css';

function GridPage() {

  useEffect(() => {
    // setWaitingFilename(true);
    api.getData()
      .then(([clicked_sentences, grid, col_names, frozen_columns, row_contents, filename]) => {
      });
  }, [])

  return (
    <div>
      <Grid />
    </div >
  );
}

export default GridPage;
