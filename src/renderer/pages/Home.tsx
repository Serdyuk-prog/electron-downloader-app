/* eslint-disable react/no-this-in-sfc,@typescript-eslint/ban-ts-comment */
import { Button } from '@mui/material';
import Icon from '@mui/material/Icon';
import { useState } from 'react';
import DlPanel from '../components/download_panel/DlPanel';
import Download from '../components/download/Download';

function HomePage() {
  class DownloadEl {
    public id: number;

    constructor(id: number) {
      this.id = id;
    }
  }

  const [downloads, setDownloads] = useState<DownloadEl[]>([]);

  const onAdd = () => {
    let newId = 0;
    if (downloads.length) {
      newId = downloads[downloads.length - 1].id + 1;
    }
    setDownloads([...downloads, new DownloadEl(newId)]);
  };

  const onDelete = (id: number) => {
    const resultingArr: DownloadEl[] = [];
    downloads.map((download) => {
      if (download.id !== id) {
        resultingArr.push(download);
      }
      return resultingArr;
    });
    setDownloads(resultingArr);
  };

  return (
    <DlPanel>
      <>
        {downloads.map((download) => {
          return (
            <Download key={download.id} id={download.id} onDelete={onDelete} />
          );
        })}
        <Button
          sx={{ alignSelf: 'center' }}
          variant="contained"
          onClick={() => {
            onAdd();
          }}
        >
          <Icon>add_ circle</Icon>
        </Button>
      </>
    </DlPanel>
  );
}

export default HomePage;
