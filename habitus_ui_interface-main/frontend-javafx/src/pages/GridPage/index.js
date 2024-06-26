
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from 'components';
import { fetchDataFromApi, toQuery } from "services"
import './styles.css';

function GridPage() {
    const [filename, setFilename] = useState('');
    const [anchor, setAnchor] = useState('');
    const [waitingFileName, setWaitingFilename] = useState(false)
    const [saveAs, setSaveAs] = useState('')
    const [openModalSave, setOpenModalSave] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        setWaitingFilename(true)
        fetchDataFromApi('/data/')
            .then(data => {
                console.log(data);
                console.log("The data was supposedly gotten.");
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
