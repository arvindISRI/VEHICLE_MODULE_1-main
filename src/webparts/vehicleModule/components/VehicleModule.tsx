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
import PendingHr1Dashboard from './VehicleApprover/Hr1Dashboard/Dashboards/PendingHr1Dashboard';
import GroupHeadDashboard from './VehicleApprover/GroupHeadDashboard/GroupHeadDashboard';
import GroupHeadVehicle from './VehicleApprover/GroupHeadDashboard/GroupHeadApprover';
import HR1ApproveVehicle from './VehicleApprover/Hr1Dashboard/Hr1Approver';
import HR2ApproverVehicle from './VehicleApprover/Hr2Dashboard/Hr2Approver';
import HR1ViewVehicle from './/VehicleApprover/Hr1Dashboard/HR1ViewVehicle';
import HR2ViewVehicle from './VehicleApprover/Hr2Dashboard/HR2ViewVehicle';
import GHViewVehicle from './VehicleApprover/GroupHeadDashboard/GroupHeadViewVehicle';


                      {/* GroupHeadViewVehicle */}
{/* HR1ViewVehicle
HR2ViewVehicle
ViewVehicle */}

// import GHViewVehicle from './VehicleApprover/GroupHeadDashboard/ViewVehicle';
import ApprovedHr1Dashboard from './VehicleApprover/Hr1Dashboard/Dashboards/ApprovedHr1Dashboard';
import RejectedHr1Dashboard from './VehicleApprover/Hr1Dashboard/Dashboards/RejectedHr1Dashboard';
import RejectedHr2Dashboard from './VehicleApprover/Hr2Dashboard/Dashboards/RejectedHr2Dashboard';
import ApprovedHr2Dashboard from './VehicleApprover/Hr2Dashboard/Dashboards/ApprovedHr2Dashboard';
import PendingHr2Dashboard from './VehicleApprover/Hr2Dashboard/Dashboards/PendingHr2Dashboard';
import PendingGHDashboard from './VehicleApprover/GroupHeadDashboard/Dashboards/PendingGHDashboard';
import ApprovedGHDashboard from './VehicleApprover/GroupHeadDashboard/Dashboards/ApprovedGHDashboard';
import RejectedGHDashboard from './VehicleApprover/GroupHeadDashboard/Dashboards/RejectedGHDashboard';
import GroupHeadViewVehicle from './VehicleApprover/GroupHeadDashboard/GroupHeadViewVehicle';
require('../assets/style.css');
require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
export default class VehicleModule extends React.Component<IVehicleModuleProps, {}> {
  public render(): React.ReactElement<IVehicleModuleProps> {
    const userPhotoUrl = '/_layouts/15/userphoto.aspx?size=L&username=' + this.props.currentSPContext.pageContext.legacyPageContext.userEmail;
    return (
      <div>
        <div id='divLoading' style={{ display: 'none' }} >
          <div className='spinner'></div>
        </div>
        <div className={styles.vehicleModule} >
          <div className={styles.container}>
            { }
            { }
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
                      { }
                      <Route path="/" exact={true} render={() => <InitiatorDashboard  {...this.props} />} />
                      <Route path="/InitiatorDashboard" exact={true} render={() => <InitiatorDashboard  {...this.props} />} />
                      <Route path="/HR2Dashboard" exact={true} render={() => <HR2Dashboard  {...this.props} />} />
                      <Route path="/HR1Dashboard" exact={true} render={() => <HR1Dashboard  {...this.props} />} />
                      <Route path="/GroupHeadDashboard" exact={true} render={() => <GroupHeadDashboard  {...this.props} />} />
                      <Route path="/AddVehicle" exact={true} render={() => <AddVehicle  {...this.props} />} />
                      { }
                      <Route path="/EditVehicle/:VMId" render={() => <EditVehicle {...this.props} />} />
                      <Route path="/ViewVehicle/:VMId" render={() => <ViewVehicle {...this.props} />} />

                      {/* GroupHeadViewVehicle */}
{/* HR1ViewVehicle
HR2ViewVehicle
ViewVehicle */}

                      <Route path="/HR1ViewVehicle/:VMId" render={() => <HR1ViewVehicle {...this.props} />} />
                      <Route path="/HR2ViewVehicle/:VMId" render={() => <HR2ViewVehicle {...this.props} />} />
                      <Route path="/GHViewVehicle/:VMId" render={() => <GHViewVehicle {...this.props} />} />
                      <Route path="/GroupHeadApproveVehicle/:VMId" render={() => <GroupHeadVehicle {...this.props} />} />
                      <Route path="/HR1ApproveVehicle/:VMId" render={() => <HR1ApproveVehicle {...this.props} />} />
                      <Route path="/HR2ApproveVehicle/:VMId" render={() => <HR2ApproverVehicle {...this.props} />} />
                      {/* <Route path="/PendingHr1Dashboard/Pending" exact={true} render={() => <PendingHr1Dashboard  {...this.props} />} />
                      <Route path="/ApprovedHr1Dashboard/Approved" exact={true} render={() => <ApprovedHr1Dashboard  {...this.props} />} />
                      <Route path="/RejectedHr1Dashboard/Rejected" exact={true} render={() => <RejectedHr1Dashboard  {...this.props} />} />
                      <Route path="/PendingHr2Dashboard/Pending" exact={true} render={() => <PendingHr2Dashboard  {...this.props} />} />
                      <Route path="/ApprovedHr2Dashboard/Approved" exact={true} render={() => <ApprovedHr2Dashboard  {...this.props} />} />
                      <Route path="/RejectedHr2Dashboard/Rejected" exact={true} render={() => <RejectedHr2Dashboard  {...this.props} />} />
                      <Route path="/PendingGHDashboard/Pending" exact={true} render={() => <PendingGHDashboard  {...this.props} />} />
                      <Route path="/ApprovedGHDashboard/Approved" exact={true} render={() => <ApprovedGHDashboard  {...this.props} />} />
                      <Route path="/RejectedGHDashboard/Rejected" exact={true} render={() => <RejectedGHDashboard  {...this.props} />} /> */}
                      { }
                    </Switch>
                  </HashRouter>
                </div>
              </div>
            </div>
            { }
          </div>
        </div>
      </div>
    );
  }
}