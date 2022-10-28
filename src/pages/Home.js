import Download from "../components/download/Download";
import DlPanel from "../components/download_panel/DlPanel";
import { Button } from "@mui/material";
import Icon from "@mui/material/Icon";
import { useState } from "react";

function HomePage() {
    class DownloadEl {
        constructor(id) {
            this.id = id;
        }
    }

    const [downloads, setDownloads] = useState([]);

    const onAdd = () => {
        let newId = 0;
        if (downloads.length) {
            newId = downloads[downloads.length - 1].id + 1;
        }
        setDownloads([...downloads, new DownloadEl(newId)]);
    };
    return (
        <DlPanel>
            {downloads.map((download) => {
                return <Download key={download.id} id={download.id} />;
            })}
            <Button
                sx={{ alignSelf: "center" }}
                variant="contained"
                onClick={() => {
                    onAdd();
                }}
            >
                <Icon>add_circle</Icon>
            </Button>
        </DlPanel>
    );
}

export default HomePage;
