import * as React from 'react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import styles from '../../VehicleModule.module.scss'
import * as moment from 'moment'

import UseUtilities, { IUtilities } from '../../../../services/bal/utilities';
import Utilities from '../../../../services/bal/utilities';
import { Formik, FormikProps, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { Web } from '@pnp/sp/presets/all';
import { BaseButton, Button, Checkbox, FontWeights, IPersonaProps } from 'office-ui-fabric-react';
import { Link, useHistory } from 'react-router-dom';
import useSPCRUD, { ISPCRUD } from '../../../../services/bal/spcrud';
import SPCRUD from '../../../../services/bal/spcrud';
import PersonalAdvanceVehicleMasterOps from '../../../../services/bal/PersonalAdvanceVehicleMaster';

import { IEmployeeMaster } from '../../../../services/interface/IEmployeeMaster';

import { keys } from '@microsoft/sp-lodash-subset';
import { Icon, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, PrimaryButton, IDropdown, } from 'office-ui-fabric-react';
import { Pivot, PivotItem, IPivotItemProps, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { SPComponentLoader } from '@microsoft/sp-loader';

import { escape } from '@microsoft/sp-lodash-subset';
import { Items, sp } from 'sp-pnp-js';
import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';

import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { ENV_CONFIG } from '../../../../../Enviroment/envConfig';
import { IVehicleModuleProps } from '../../IVehicleModuleProps';
import { SPFxAdalClient } from '@pnp/common';
SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css');
SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

export default class GroupHeadDashboard extends React.Component<IVehicleModuleProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      GroupHeadDashboard: [],
      ShowGHTab: false,
      activeTab: 'Pending',

      GroupHeadApprovedDashboard: [],
      GroupHeadRejectedDashboard: []
    };

  }
  async componentDidMount() {

    await this.checkUserInGroupsForGHTab(["GROUPHEAD"]);

    await this.getCurrentGroupHead();
    await this.GroupHeadPendingDashboard();

    await this.GroupHeadApprovedDashboards();
    await this.GroupHeadRejectedDashboards();

  }

  public async checkUserInGroups(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      if (!userGroups || userGroups.length == 0) {
        console.log("User is not part of any group.");
        return false;
      }
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        this.setState({ showhideEmployeeNameLab: true, OnBehalf: 'No', isOnBehalfDisabled: true })
        console.log(`User exists in at least one of the specified groups.`);
      } else {
        this.setState({ showhideEmployeeNameLab: false, OnBehalf: 'No', isOnBehalfDisabled: false })
        console.log(`User does not exist in any of the specified groups.`);
      }
    } catch (error) {
      console.error("Error checking user in groups:", error);
    }
  }
  public async checkUserInGroupsForHR2Tab(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      if (!userGroups || userGroups.length == 0) {
        console.log("User is not part of any group.");
        return false;
      }
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        console.log(`User exists in at least one of the specified groups.`);
        this.setState({ ShowHR2Tab: true })
      }
    } catch (error) {
      console.error("Error checking user in groups:", error);
      return false;
    }
  }

  public async checkUserInGroupsForGHTab(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      if (!userGroups || userGroups.length == 0) {
        console.log("User is not part of any group.");
        return false;
      }
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        this.setState({ ShowGHTab: true })
      }
    } catch (error) {
      console.error("Error checking user in groups:", error);
      return false;
    }
  }
  public async checkUserInGroupsForHR1Tab(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      if (!userGroups || userGroups.length == 0) {
        console.log("User is not part of any group.");
        return false;
      }
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        this.setState({ ShowHR1Tab: true })
      }
    } catch (error) {
      console.error("Error checking user in groups:", error);
      return false;
    }
  }

  public getCurrentGroupHead = async () => {
    const spCrudObj = await useSPCRUD();
    return await spCrudObj.currentUser(this.props).then(cuser => {
      this.setState({ Currentuser: cuser });
      return cuser;
    });
  }
  public setActiveTab = (tabName: string) => {
    this.setState({ activeTab: tabName });
  };

  public GroupHeadPendingDashboard = async () => {
    return await PersonalAdvanceVehicleMasterOps().getGroupHeadDashboard(this.props).then(GroupHeadPending => {
      this.setState({ GroupHeadDashboard: GroupHeadPending });
      console.log(GroupHeadPending);

      return GroupHeadPending;
      console.log(GroupHeadPending);
    });
  };
  public GroupHeadApprovedDashboards = async () => {
    return await PersonalAdvanceVehicleMasterOps().getGroupHeadApprovedDashboard(this.props).then(GroupHeadApproved => {
      this.setState({ GroupHeadApprovedDashboard: GroupHeadApproved });
      return GroupHeadApproved;
    });
  };
  public GroupHeadRejectedDashboards = async () => {
    return await PersonalAdvanceVehicleMasterOps().getGroupHeadRejectedDashboard(this.props).then(GroupHeadRejected => {
      this.setState({ GroupHeadRejectedDashboard: GroupHeadRejected });
      return GroupHeadRejected;
    });
  };

  public openPage(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
  }

  public render(): React.ReactElement<IVehicleModuleProps> {
    const { selectedOption } = this.state;
    const value = selectedOption;

    return (
      <div className='widget-card' hidden={!this.state.ShowGHTab}>
        <div className='widget-card-head'>
          <span className='widget-card-head-icon'>
            <Icon iconName='ContactInfo' />
          </span>
          <h2 className='widget-card-head-title'>GroupHead Dashboard</h2>
          { }
        </div>
        <div className='widget-card-body'>
          <Pivot linkSize={PivotLinkSize.large} linkFormat={PivotLinkFormat.tabs} >
            <PivotItem linkText='GroupHead Dashboard'>
              <div className='row'>
                <div className={styles.tabnav + " " + 'col-md-2'}>
                  <button className="tablink" onClick={() => this.setActiveTab("Pending")}>Pending</button>
                  <button className="tablink" onClick={() => this.setActiveTab("Approved")}>Approved</button>
                  <button className="tablink" onClick={() => this.setActiveTab("Rejected")}>Rejected</button>

                </div>
                <div className='col-md-10'>
                  <div className={styles.panelbody}>
                    {this.state.activeTab == 'Pending' && (

                      <div id="Pending" className="tabcontent active table-responsive">
                        <h3>Pending</h3>
                        <table className="table ">
                          <tr>
                            <th>Action</th>
                            <th>VM ID</th>
                            <th>EmployeeID</th>
                            <th>EmployeeName</th>
                            <th>Age</th>
                            <th>Status</th>
                          </tr>
                          {
                            this.state.GroupHeadDashboard.length > 0 ? this.state.GroupHeadDashboard.map((items) => {
                              return (
                                <tr>
                                  <td>
                                    <a href={'#/GHViewVehicle/' + items.ID}>
                                      <Icon iconName='View' style={{ cursor: 'pointer' }}
                                        title='View' />

                                    </a>

                                    {
                                      items.Status == "Pending" &&

                                      <a href={'#/GroupHeadApproveVehicle/' + items.ID}>
                                        <Icon iconName='CheckMark' title='Approve' style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                      </a>

                                    }

                                  </td>

                                  <td>{items.Title}</td>
                                  <td>{items.EmployeeCode}</td>
                                  <td>{items.EmployeeName}</td>
                                  <td>{items.Age}</td>
                                  <td>{items.Status}</td>
                                </tr>
                              )
                            })
                              : ""
                          }
                        </table>

                      </div>
                    )}
                    {this.state.activeTab == 'Approved' && (
                      <div id="Approved" className="tabcontent">
                        <h3>Approved</h3>
                        <table className="table ">
                          <tr>
                            <th>Action</th>
                            <th>VM ID</th>
                            <th>EmployeeID</th>
                            <th>EmployeeName</th>
                            <th>Age</th>
                            <th>Status</th>
                          </tr>
                          {
                            this.state.GroupHeadApprovedDashboard.length > 0 ? this.state.GroupHeadApprovedDashboard.map((items) => {
                              return (
                                <tr>
                                  <td>
                                    <a href={'#/GHViewVehicle/' + items.ID}>
                                      <Icon iconName='View' style={{ cursor: 'pointer' }}
                                        title='View' />

                                    </a>

                                    { }

                                  </td>

                                  <td>{items.Title}</td>
                                  <td>{items.EmployeeCode}</td>
                                  <td>{items.EmployeeName}</td>
                                  <td>{items.Age}</td>
                                  <td>{items.Status}</td>
                                </tr>
                              )
                            })
                              : ""
                          }
                        </table>
                      </div>
                    )}

                    {this.state.activeTab == 'Rejected' && (
                      <div id="Rejected" className="tabcontent">
                        <h3>Rejected</h3>
                        <table className="table ">
                          <tr>
                            <th>Action</th>
                            <th>VM ID</th>
                            <th>EmployeeID</th>
                            <th>EmployeeName</th>
                            <th>Age</th>
                            <th>Status</th>
                          </tr>
                          {
                            this.state.GroupHeadRejectedDashboard.length > 0 ? this.state.GroupHeadRejectedDashboard.map((items) => {
                              return (
                                <tr>
                                  <td>
                                    <a href={'#/GHViewVehicle/' + items.ID}>
                                      <Icon iconName='View' style={{ cursor: 'pointer' }}
                                        title='View' />

                                    </a>

                                    { }

                                  </td>

                                  <td>{items.Title}</td>
                                  <td>{items.EmployeeCode}</td>
                                  <td>{items.EmployeeName}</td>
                                  <td>{items.Age}</td>
                                  <td>{items.Status}</td>
                                </tr>
                              )
                            })
                              : ""
                          }
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </PivotItem>
          </Pivot>

        </div>
      </div>

    );
  }

  public editDraftItem = async (Items) => {
    console.log(Items);
    const ApproverViewReqItems = Items;

  }
  viewItem(items: any): void {
    throw new Error('Method not implemented.');
  }
}