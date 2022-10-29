import { TextField, Button, Box, Divider } from "@mui/material";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

function Download(props) {
    class BtnState {
        constructor(variant, text, isDisabled) {
            this.variant = variant;
            this.text = text;
            this.isDisabled = isDisabled;
        }
    }

    class DownloadState {
        constructor(name, btnState) {
            this.name = name;
            this.btnState = btnState;
        }
    }

    const downloadStateOptions = {
        ready: new DownloadState(
            "ready",
            new BtnState("contained", "Скачать", false)
        ),
        inProgress: new DownloadState(
            "inProgress",
            new BtnState("outlined", "Пауза", false)
        ),
        stopped: new DownloadState(
            "stopped",
            new BtnState("outlined", "Продолжить", false)
        ),
        done: new DownloadState(
            "done",
            new BtnState("contained", "Готово", true)
        ),
    };

    const [downloadState, setDownloadState] = useState(
        downloadStateOptions.ready
    );
    const [progPercent] = useState(0);
    const [url, setUrl] = useState("");

    const clickDownloadHandler = () => {
        if (downloadState.name === downloadStateOptions.ready.name) {
            setDownloadState(downloadStateOptions.inProgress);
            return;
        }
        if (downloadState.name === downloadStateOptions.inProgress.name) {
            setDownloadState(downloadStateOptions.stopped);
            return;
        }
    };

    return (
        <Box id={props.id} sx={{ mb: 3 }}>
            <Box
                sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}
            >
                <TextField
                    id="outlined-basic"
                    label="URL"
                    variant="outlined"
                    sx={{ width: "40%" }}
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                    }}
                />
                <Button
                    sx={{ alignSelf: "center" }}
                    variant={downloadState.btnState.variant}
                    onClick={() => {
                        clickDownloadHandler();
                    }}
                    disabled={downloadState.btnState.isDisabled}
                >
                    {downloadState.btnState.text}
                </Button>
                <Box
                    sx={{
                        width: "20%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <span>{`${progPercent}%`}</span>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <IconButton
                        onClick={() => {
                            props.onDelete(props.id);
                        }}
                    >
                        <Icon>cancel</Icon>
                    </IconButton>
                </Box>
            </Box>
            <Divider />
        </Box>
    );
}

export default Download;
