export default class BtnState {
  public variant: string;

  public text: string;

  public isDisabled: boolean;

  constructor(variant: string, text: string, isDisabled: boolean) {
    this.variant = variant;
    this.text = text;
    this.isDisabled = isDisabled;
  }
}
