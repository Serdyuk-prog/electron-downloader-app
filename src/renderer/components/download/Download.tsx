import { TextField, Button, Box, Divider } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { Progress } from 'electron-dl';
import BtnState from 'renderer/ts/classes/btn.state';
import DownloadState from 'renderer/ts/classes/download.state';
import { DownloadProps } from 'renderer/ts/types/download.props';
import { toast } from 'react-toastify';

function Download({ id, onDelete }: DownloadProps) {
  const downloadStateOptions = {
    ready: new DownloadState(
      'ready',
      new BtnState('contained', 'Скачать', false)
    ),
    inProgress: new DownloadState(
      'inProgress',
      new BtnState('outlined', 'Пауза', false)
    ),
    stopped: new DownloadState(
      'stopped',
      new BtnState('outlined', 'Продолжить', false)
    ),
    forced_stop: new DownloadState(
      'forced_stop',
      new BtnState('contained', 'Остановлено', true)
    ),
    done: new DownloadState('done', new BtnState('contained', 'Готово', true)),
  };

  const [downloadState, setDownloadState] = useState(
    downloadStateOptions.ready
  );
  const [progPercent, setProgPercent] = useState(0);
  const [url, setUrl] = useState('');
  const [downloadUuid, setDownloadUuid] = useState('');

  const onDownload = () => {
    const uuid = crypto.randomUUID();
    setDownloadUuid(uuid);

    window.electron.ipcRenderer.sendMessage('download', [url, uuid]);
  };

  const clickDownloadHandler = () => {
    switch (downloadState.name) {
      case downloadStateOptions.ready.name:
        setDownloadState(downloadStateOptions.inProgress);
        onDownload();
        break;
      case downloadStateOptions.inProgress.name:
        window.electron.ipcRenderer.sendMessage('download-pause', [
          downloadUuid,
        ]);
        setDownloadState(downloadStateOptions.stopped);
        break;
      case downloadStateOptions.stopped.name:
        window.electron.ipcRenderer.sendMessage('download-unpause', [
          downloadUuid,
        ]);
        setDownloadState(downloadStateOptions.inProgress);
        break;
      default:
    }
  };

  const clickDeleteHandler = () => {
    if (downloadState.name === downloadStateOptions.ready.name) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('download-cancel', [downloadUuid]);
  };

  // Функция для alert с ошибкой
  const notify = (text: string, toastId?: number | string) => {
    toast.error(text, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      toastId,
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(
      `download-progress-${downloadUuid}`,
      (args) => {
        const progress: Progress = args as Progress;
        if (downloadState.name === downloadStateOptions.forced_stop.name)
          setDownloadState(downloadStateOptions.inProgress);
        setProgPercent(progress.percent * 100);
      }
    );

    window.electron.ipcRenderer.once(
      `download-complete-${downloadUuid}`,
      () => {
        setDownloadState(downloadStateOptions.done);
      }
    );

    window.electron.ipcRenderer.once(`download-started-${downloadUuid}`, () => {
      setDownloadState(downloadStateOptions.inProgress);
    });

    window.electron.ipcRenderer.once(
      `download-interrupted-${downloadUuid}`,
      () => {
        if (
          downloadState.name === downloadStateOptions.inProgress.name ||
          downloadState.name === downloadStateOptions.stopped.name
        ) {
          notify('Загрузка вынужденно приостановлена', 'forced_stopped');
        }

        setDownloadState(downloadStateOptions.forced_stop);
      }
    );

    window.electron.ipcRenderer.once('no-url-specified', () => {
      console.log(`Received no-url-specified`);
      notify('Неправильный url', 'no-url-specified');
      setDownloadState(downloadStateOptions.ready);
    });
  }, [
    downloadUuid,
    downloadState.name,
    downloadStateOptions.done,
    downloadStateOptions.forced_stop,
    downloadStateOptions.inProgress,
    downloadStateOptions.ready,
    downloadStateOptions.stopped.name,
  ]);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          id="outlined-basic"
          label="URL"
          variant="outlined"
          sx={{ width: '40%' }}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <Button
          sx={{ alignSelf: 'center' }}
          onClick={() => {
            clickDownloadHandler();
          }}
          disabled={downloadState.btnState.isDisabled}
        >
          {downloadState.btnState.text}
        </Button>
        <Box
          sx={{
            width: '20%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span>{`${progPercent.toFixed(2)}%`}</span>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={() => {
              clickDeleteHandler();
              onDelete(id);
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
