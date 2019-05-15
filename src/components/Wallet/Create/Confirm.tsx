import * as React from "react";
import { connect } from "react-redux";
import { setWalletStep, WALLET_STEPS, loadHydroWallet } from "../../../actions/wallet";
import { WalletState } from "../../../reducers/wallet";
import { HydroWallet } from "../../../wallets";
import { translations } from "../../../i18n";

interface Props {
  dispatch: any;
  wallet: HydroWallet;
  password: string;
}

interface State {
  checkbox: boolean[];
  processing: boolean;
}

const mapStateToProps = (state: any) => {
  const walletState: WalletState = state.WalletReducer;
  const walletCache = walletState.get("walletCache");
  return {
    wallet: walletCache.wallet,
    password: walletCache.password
  };
};

class CreateConfirm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkbox: new Array(translations.createConfirm.length).fill(false),
      processing: false
    };
  }

  public render() {
    const { checkbox, processing } = this.state;
    return (
      <div className="HydroSDK-confirm">
        {this.renderConfirmCheckbox()}
        <div className="HydroSDK-desc">{translations.confirmDesc}</div>
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          type="submit"
          onClick={() => this.handleSubmit()}
          disabled={checkbox.indexOf(false) !== -1 || processing}>
          {processing ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} {translations.create}
        </button>
      </div>
    );
  }

  public async handleSubmit() {
    const { dispatch, wallet, password } = this.props;
    this.setState({ processing: true });
    await wallet.save(password);
    await dispatch(loadHydroWallet(wallet));
    this.setState({ processing: false });
    dispatch(setWalletStep(WALLET_STEPS.ADD_FUNDS));
  }
  public renderConfirmCheckbox() {
    const { checkbox } = this.state;
    const nodes = checkbox.map((checked: boolean, index: number) => {
      return (
        <div
          key={index}
          className={`HydroSDK-checkboxDiv ${checked ? "checked" : ""}`}
          onClick={() => this.handleCheck(index)}>
          <div className="HydroSDK-checkbox">
            <i className="fa fa-check" />
          </div>
          {translations.createConfirm[index]}
        </div>
      );
    });
    return <div className="HydroSDK-checkboxGroup">{nodes}</div>;
  }

  public handleCheck(index: number) {
    const { checkbox: oldCheckbox } = this.state;
    let checkbox = oldCheckbox.slice();
    checkbox[index] = !oldCheckbox[index];

    this.setState({ checkbox });
  }
}

export default connect(mapStateToProps)(CreateConfirm);