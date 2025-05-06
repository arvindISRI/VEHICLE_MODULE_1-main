// import * as React from 'react';
// import styles from './VehicleModule.module.scss';
// import { IVehicleModuleProps } from './IVehicleModuleProps';
// import { escape } from '@microsoft/sp-lodash-subset';

// export default class VehicleModule extends React.Component < IVehicleModuleProps, {} > {
//   public render(): React.ReactElement<IVehicleModuleProps> {
//     return(
//       <div className = { styles.vehicleModule } >
//   <div className={styles.container}>
//     <div className={styles.row}>
//       <div className={styles.column}>
//         <span className={styles.title}>Welcome to Vehicle Module!</span>
//         <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
//         <p className={styles.description}>{escape(this.props.description)}</p>
//         <a href='https://aka.ms/spfx' className={styles.button}>
//           <span className={styles.label}>Learn more</span>
//         </a>
//       </div>
//     </div>
//   </div>
//       </div >
//     );
//   }
// }


import * as React from 'react';
import styles from './VehicleModule.module.scss';
import { IVehicleModuleProps } from './IVehicleModuleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IList, Web } from "@pnp/sp/presets/all";
import { BrowserRouter as Router, Switch, Route, Link, HashRouter, match, useParams, Redirect } from 'react-router-dom';

import { sp } from '@pnp/sp';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import AddVehicle from './VehicleCreation/AddVehicle';
import InitiatorDashboard from './VehicleCreation/InitiatorDashboard';
import Navigation from './Navigation/Navigation';
import EditVehicle from './VehicleCreation/EditVehicle';
import ViewVehicle from './VehicleCreation/ViewVehicle';
import HR2Dashboard from './VehicleApprover/Hr2Dashboard/Hr2Dashboard';
import HR1Dashboard from './VehicleApprover/Hr1Dashboard/Hr1Dashboard';
import GroupHeadDashboard from './VehicleApprover/GroupHeadDashboard/GroupHeadDashboard';
import GroupHeadVehicle from './VehicleApprover/GroupHeadDashboard/GroupHeadApprover';
import HR1ApproveVehicle from './VehicleApprover/Hr1Dashboard/Hr1Approver';
import HR2ApproverVehicle from './VehicleApprover/Hr2Dashboard/Hr2Approver';
import HR1ViewVehicle from './VehicleApprover/Hr1Dashboard/ViewVehicle';
import HR2ViewVehicle from './VehicleApprover/Hr2Dashboard/ViewVehicle';
import GHViewVehicle from './VehicleApprover/GroupHeadDashboard/ViewVehicle';
require('../assets/style.css');
require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
export default class VehicleModule extends React.Component < IVehicleModuleProps, {} > {
  public render(): React.ReactElement<IVehicleModuleProps> {
    // return(
    //   <section >
    //     <div id='divLoader' className={'divLoader'}></div>
    //     <HashRouter>
    //       <div className='wrapper'>
    //         <div className='main'>
    //           <div className='content'>
    //             <Switch>

    //               <Route path="/" exact={true} render={() => <InitiatorDashboard  {...this.props} />} />
    //               <Route path="/InitiatorDashboard" exact={true} render={() => <InitiatorDashboard  {...this.props} />} />
    //               <Route path="/AddVehicle" exact={true} render={() => <AddVehicle  {...this.props} />} />


    //             </Switch>
    //           </div>
    //         </div>
    //       </div>
    //     </HashRouter>
    //   </section>
    // );
 
 
 
 //


 const userPhotoUrl = '/_layouts/15/userphoto.aspx?size=L&username=' + this.props.currentSPContext.pageContext.legacyPageContext.userEmail;
    return (
      <div>
        <div id='divLoading' style={{display: 'none'}} >
          <div className='spinner'></div>
        </div>
        <div className={styles.vehicleModule} >
          <div className={styles.container}>
            {/* <div className={styles.row}>
              <div className={styles.column}>
                <span className={styles.title}>Welcome to SharePoint!</span>
                <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
                <p className={styles.description}>{escape(this.props.description)}</p>
                <a href='https://aka.ms/spfx' className={styles.button}>
                  <span className={styles.label}>Learn more</span>
                </a>
              </div>
            </div> */}
            {/* <div className='profile-header'>
              <Icon iconName='PublicContactCard'></Icon>&nbsp;Employee Profile
            </div> */}
            <div className='profile-header'>
              <div className='profile-header-top'>
                <div className='profile-header-top-left'>
                  <a title='EXIM Bank India' className='ms-siteicon-a' href={this.props.currentSPContext.pageContext.web.absoluteUrl}>
                    <img className='ms-siteicon-img' src='/SiteAssets/EximHome/Images/EXIM_Logo.png' />
                  </a>
                </div>
                <div className='profile-header-top-right'>
                  <div className='profile-header-top-right-user'>
                    <div className='profile-header-top-right-user-details'>
                      <ul>
                        <li>{this.props.currentSPContext.pageContext.legacyPageContext.userLoginName}</li>
                        <li>{this.props.currentSPContext.pageContext.legacyPageContext.userEmail}</li>
                      </ul>
                    </div>
                    <div className='profile-header-top-right-user-image'>
                      <img className='ms-siteicon-img' src={userPhotoUrl} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='customDivSeprator'></div>
            <Navigation {...this.props} />
            <div className='ms-Grid'>
              <div className='ms-Grid-row'>
                <div className='ms-Grid-col ms-sm6 ms-md8 ms-lg12'>
                  <HashRouter>
                    <Switch>
                      {/* <Route path="/" exact={true} render={() => <UserDashboard  {...this.props} />} />
                      <Route path="/request" render={() => <NoteCreation  {...this.props} />} />
                      <Route path="/EditForm/:NoteId" render={() => <NoteEditForm  {...this.props} />} />
                      <Route path="/ViewForm/:NoteId" render={() => <NoteViewForm  {...this.props} />} />
                      <Route path="/ApproverForm/:NoteId" render={() => <NoteApproverForm  {...this.props} />} />
                      <Route path="/ApproverDashboard" render={() => <ApproverDashboard  {...this.props} />} />
                      <Route path="/ReferenceDocDashboard" render={() => <ReferenceDocDashboard  {...this.props} />} /> */}
                  
                  <Route path="/" exact={true} render={() => <InitiatorDashboard  {...this.props} />} />
                  <Route path="/InitiatorDashboard" exact={true} render={() => <InitiatorDashboard  {...this.props} />} />

                  <Route path="/HR2Dashboard" exact={true} render={() => <HR2Dashboard  {...this.props} />} />
                  <Route path="/HR1Dashboard" exact={true} render={() => <HR1Dashboard  {...this.props} />} />
                  <Route path="/GroupHeadDashboard" exact={true} render={() => <GroupHeadDashboard  {...this.props} />} />


                   <Route path="/AddVehicle" exact={true} render={() => <AddVehicle  {...this.props} />} />
                   {/* <Route path="/EditVehicle" exact={true} render={() => <EditVehicle  {...this.props} />} /> */}
                   <Route path="/EditVehicle/:VMId" render={() => <EditVehicle {...this.props} />} />
                   <Route path="/ViewVehicle/:VMId" render={() => <ViewVehicle {...this.props} />} />
                   <Route path="/HR1ViewVehicle/:VMId" render={() => <HR1ViewVehicle {...this.props} />} />
                   <Route path="/HR2ViewVehicle/:VMId" render={() => <HR2ViewVehicle {...this.props} />} />
                   <Route path="/GHViewVehicle/:VMId" render={() => <GHViewVehicle {...this.props} />} />


                   <Route path="/GroupHeadApproveVehicle/:VMId" render={() => <GroupHeadVehicle {...this.props} />} />
                   <Route path="/HR1ApproveVehicle/:VMId" render={() => <HR1ApproveVehicle {...this.props} />} />
                   <Route path="/HR2ApproveVehicle/:VMId" render={() => <HR2ApproverVehicle {...this.props} />} />

                   {/* <Route path="/ViewForm/:NoteId" render={() => <NoteViewForm  {...this.props} />} />
                      <Route path="/ApproverForm/:NoteId" render={() => <NoteApproverForm  {...this.props} />} /> */}

                   
                    </Switch>
                  </HashRouter>
                </div>
              </div>
            </div>
            {/* <footer>
              <div className="left">
                <img src="/sites/mysites/SiteAssets/EximHome/Images/brand.png" alt="" data-themekey="#" width={150} height={60} />
                <a href="https://www.eximbankindia.in/" target='blank'>EXIM<br />
                  <strong>Bank</strong>
                </a>
                <a href="https://www.eximbankindia.in/press-releases" target='blank'>EXIM<br />
                  <strong>Press Release</strong>
                </a>
                <a href="https://www.eximbankindia.in/exim-finserve.aspx" target='blank'>EXIM<br />
                  <strong>Finserve</strong>
                </a>
              </div>
              <div className="right">
                <div className="copyright">
                  <p>All Rights Reserved © EXIMBANK 2025</p>
                </div>
                <div className="disclaimer">
                  <a href="https://www.eximbankindia.in/terms" target='blank'>Terms of Use</a>
                  <a href="https://www.eximbankindia.in/privacy-policy" target='blank'>Privacy Policy</a>
                </div>
              </div>
            </footer> */}
          </div>
        </div>
      </div>
    );
  }
}