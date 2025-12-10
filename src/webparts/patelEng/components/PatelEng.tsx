import * as React from 'react';
import styles from './PatelEng.module.scss';
// import styles
import type { IPatelEngProps } from './IPatelEngProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { InitiatorLanding } from "./Pages/InitiatorLandingPage";
import { NewRequest } from './Pages/NewRequest';
import { EditRequest } from './Pages/EditRequest';
import { BrowserRouter as Router, Switch, Route, Link, HashRouter, match, useParams, Redirect } from 'react-router-dom';
import { GRNExcelUploadForm } from './Pages/ExcelValidation';

export default class PatelEng extends React.Component<IPatelEngProps, {}> {
  public render(): React.ReactElement<IPatelEngProps> {
    const {
      hasTeamsContext,
      
    } = this.props;

    return (
      <section>
        <div id='divBlockRequestsLoader' className={'blockRequestLoader'}></div>

        <div>
        <HashRouter>
                <Switch>                 
                     <Route path='/' exact={true}  render={() => <NewRequest  {...this.props} />} />
                   <Route path='/InitiatorLanding'  render={() => <InitiatorLanding  {...this.props} />} />
                   <Route path='/EditRequest/:ArtIntId'  render={() => <EditRequest  {...this.props} />} />
                  <Route path='/GRNExcelUploadForm' exact={true} render={() => <GRNExcelUploadForm {...this.props} />} />
                   
                   {/* <Route path='/ViewPendingApprovalSCView'  render={() => <ViewPendingApprovalSCView  {...this.props} />} /> */}

                   
                    </Switch>
              </HashRouter>
        </div>
      </section>
    );
  }
}
