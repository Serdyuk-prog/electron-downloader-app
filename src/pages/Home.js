import Download from "../components/download/Download";
import DlPanel from "../components/download_panel/DlPanel";
import { Button } from "@mui/material";
import Icon from "@mui/material/Icon";

function HomePage() {
    return (
        <DlPanel>
            <Download />
            <Button sx={{ alignSelf: "center" }} variant="contained">
                <Icon>add_circle</Icon>
            </Button>
        </DlPanel>
    );
}

export default HomePage;
