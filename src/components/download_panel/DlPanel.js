import { Box } from "@mui/material";

function DlPanel(props) {
    const panelStyle = {
        m: 3,
        width: "60%",
        display: "flex",
        flexDirection: "column",
    };
    return <Box sx={panelStyle}>{props.children}</Box>;
}

export default DlPanel;
