import BtnState from './btn.state';

export default class DownloadState {
  name: string;

  btnState: BtnState;

  constructor(name: string, btnState: BtnState) {
    this.name = name;
    this.btnState = btnState;
  }
}
