import * as React from 'react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import styles from '../VehicleModule.module.scss'
import * as moment from 'moment'
import UseUtilities, { IUtilities } from '../../../services/bal/utilities';
import Utilities from '../../../services/bal/utilities';
import { Formik, FormikProps, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { Web } from '@pnp/sp/presets/all';
import { BaseButton, Button, Checkbox, FontWeights, IPersonaProps } from 'office-ui-fabric-react';
import { Link, useHistory } from 'react-router-dom';
import useSPCRUD, { ISPCRUD } from '../../../services/bal/spcrud';
import SPCRUD from '../../../services/bal/spcrud';
import PersonalAdvanceVehicleMasterOps from '../../../services/bal/PersonalAdvanceVehicleMaster';
import { IEmployeeMaster } from '../../../services/interface/IEmployeeMaster';
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
import { ENV_CONFIG } from '../../../../Enviroment/envConfig';
import { IVehicleModuleProps } from '../IVehicleModuleProps';
import { SPFxAdalClient } from '@pnp/common';
SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css');
SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
export default class InitiatorDashboard extends React.Component<IVehicleModuleProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      UserDashboard: [],
      UserApprovedDashboard: [],
      UserRejectedDashboard: [],
      ShowUserTab: false,
      activeTab: 'Pending',
      // filteredData: [],            // Filtered data after search
      ApprovedFilter: [],
      PendingfilteredData: [],
      RejectedfilteredData: [],
      PendingUserDashboardfiltered: [],
      ApprovedUserDashboardfiltered: [],
      RejectedUserDashboardfiltered: [],
      PedingFilter: [],
      RejectedFilter: [],
      currentPage: 1,
      itemsPerPage: 5,
      searchTerm: ''
    };
  }
  async componentDidMount() {
    await this.getCurrentUser();
    // await this.checkUserInGroupsForUserTab(["User_Group"]);
    await this.UserPendingDashboard();
    await this.UserApprovedDashboards();
    await this.UserRejectedDashboards();


  }

  // pagination and common filter search--



  PendinghandleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const PendingUserDashboardfiltered = this.state.UserDashboard.filter(item =>
      item.EmployeeCode.toLowerCase().includes(term) ||
      item.EmployeeName.toLowerCase().includes(term) ||
      item.Title.toLowerCase().includes(term) ||
      item.Status.toLowerCase().includes(term)
    );
    this.setState({ searchTerm: term, PedingFilter: PendingUserDashboardfiltered, currentPage: 1 });
  }
  PendinghandlePageChange = (direction) => {
    const { currentPage } = this.state;
    if (direction === 'prev' && currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    } else if (direction === 'next' && currentPage < this.PendingpageCount()) {
      this.setState({ currentPage: currentPage + 1 });
    }
  }
  PendingpageCount = () => {
    return Math.ceil(this.state.PedingFilter.length / this.state.itemsPerPage);
  }




  ApprovedhandleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const ApprovedUserDashboardfiltered = this.state.UserApprovedDashboard.filter(item =>
      item.EmployeeCode.toLowerCase().includes(term) ||
      item.EmployeeName.toLowerCase().includes(term) ||
      item.Title.toLowerCase().includes(term) ||
      item.Status.toLowerCase().includes(term)
    );
    this.setState({ searchTerm: term, ApprovedFilter: ApprovedUserDashboardfiltered, currentPage: 1 });
  }
  ApprovedhandlePageChange = (direction) => {
    const { currentPage } = this.state;
    if (direction === 'prev' && currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    } else if (direction === 'next' && currentPage < this.ApprovedpageCount()) {
      this.setState({ currentPage: currentPage + 1 });
    }
  }
  ApprovedpageCount = () => {
    return Math.ceil(this.state.ApprovedFilter.length / this.state.itemsPerPage);
  }







  RejectedhandleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const RejectedUserDashboardfiltered = this.state.UserRejectedDashboard.filter(item =>
      item.EmployeeCode.toLowerCase().includes(term) ||
      item.EmployeeName.toLowerCase().includes(term) ||
      item.Title.toLowerCase().includes(term) ||
      item.Status.toLowerCase().includes(term)
    );
    this.setState({ searchTerm: term, RejectedFilter: RejectedUserDashboardfiltered, currentPage: 1 });
  }
  RejectedhandlePageChange = (direction) => {
    const { currentPage } = this.state;
    if (direction === 'prev' && currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    } else if (direction === 'next' && currentPage < this.RejectedpageCount()) {
      this.setState({ currentPage: currentPage + 1 });
    }
  }
  RejectedpageCount = () => {
    return Math.ceil(this.state.RejectedFilter.length / this.state.itemsPerPage);
  }







  // 
  public getCurrentUser = async () => {
    const spCrudObj = await useSPCRUD();
    return await spCrudObj.currentUser(this.props).then(cuser => {
      this.setState({ Currentuser: cuser });
      return cuser;
    });
  }
  public setActiveTab = (tabName: string) => {
    this.setState({ activeTab: tabName });
  };
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
  // public async checkUserInGroupsForHR2Tab(groups: any) {
  //   try {
  //     const spCrudObj = await useSPCRUD();
  //     const userGroups = await spCrudObj.currentUserGroup(this.props);
  //     if (!userGroups || userGroups.length == 0) {
  //       console.log("User is not part of any group.");
  //       return false;
  //     }
  //     const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
  //     if (isUserInGroup) {
  //       console.log(`User exists in at least one of the specified groups.`);
  //       this.setState({ ShowHR2Tab: true })
  //     }
  //   } catch (error) {
  //     console.error("Error checking user in groups:", error);
  //     return false;
  //   }
  // }
  public async checkUserInGroupsForUserTab(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      if (!userGroups || userGroups.length == 0) {
        console.log("User is not part of any group.");
        return false;
      }
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        this.setState({ ShowUserTab: true })
      }
    } catch (error) {
      console.error("Error checking user in groups:", error);
      return false;
    }
  }
  public UserPendingDashboard = async () => {
    return await PersonalAdvanceVehicleMasterOps().getUserDashboard(this.props).then(UserPending => {
      this.setState({ UserDashboard: UserPending });
      console.log(UserPending);
      const PendingUserDashboardfiltered = this.state.UserDashboard;
      this.setState({ PedingFilter: PendingUserDashboardfiltered, currentPage: 1 });

      return UserPending;
      console.log(UserPending);
    });
  };
  public UserApprovedDashboards = async () => {
    return await PersonalAdvanceVehicleMasterOps().getUserApprovedDashboard(this.props).then(UserApproved => {
      this.setState({ UserApprovedDashboard: UserApproved });

      // const UserDashboardfiltered = this.state.UserApprovedDashboard;
      // this.setState({ ApprovedFilter: UserDashboardfiltered, currentPage: 1 });

      const ApprovedUserDashboardfiltered = this.state.UserApprovedDashboard;
      this.setState({ ApprovedFilter: ApprovedUserDashboardfiltered, currentPage: 1 });

      return UserApproved;
    });
  };
  public UserRejectedDashboards = async () => {
    return await PersonalAdvanceVehicleMasterOps().getUserRejectedDashboard(this.props).then(UserRejected => {
      this.setState({ UserRejectedDashboard: UserRejected });
      const RejectedUserDashboardfiltered = this.state.UserRejectedDashboard;
      this.setState({ RejectedFilter: RejectedUserDashboardfiltered, currentPage: 1 });

      return UserRejected;
    });
  };

  PendinghandlePageClick(pageNum: number) {
    this.setState({ currentPage: pageNum });
  }
  ApprovedhandlePageClick(pageNum: number) {
    this.setState({ currentPage: pageNum });
  }
  RejectedhandlePageClick(pageNum: number) {
    this.setState({ currentPage: pageNum });
  }
  public render(): React.ReactElement<IVehicleModuleProps> {
    const { selectedOption } = this.state;
    const value = selectedOption;
    const { PedingFilter, ApprovedFilter, RejectedFilter, currentPage, itemsPerPage, searchTerm } = this.state;


    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const PendingcurrentItems = this.state.PedingFilter.slice(startIndex, startIndex + itemsPerPage);
    const ApprovedcurrentItems = this.state.ApprovedFilter.slice(startIndex, startIndex + itemsPerPage);
    const RejectedcurrentItems = this.state.RejectedFilter.slice(startIndex, startIndex + itemsPerPage);
    // ApprovedFilter
    // PendingfilteredData
    // RejectedfilteredData

    return (
      <div className='widget-card'>
        <div className='widget-card-head'>
          <span className='widget-card-head-icon'>
            <Icon iconName='ContactInfo' />
          </span>
          <h2 className='widget-card-head-title'>User Dashboard</h2>
          <span className='widget-card-head-btn'>
            <PrimaryButton data-automation-id='btn-update-profile' iconProps={{ iconName: 'EditContact' }}
              text='Add Vehicle' onClick={() => { window.location.href = '#/AddVehicle' }} />
          </span>        </div>
        <div className='widget-card-body'>
          <Pivot linkSize={PivotLinkSize.large} linkFormat={PivotLinkFormat.tabs} >
            <PivotItem linkText='User Dashboard'>
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

                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={this.PendinghandleSearch}
                          style={{ marginBottom: '10px', padding: '5px' }}
                        />
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Action</th>
                              <th>VM ID</th>
                              <th>EmployeeID</th>
                              <th>EmployeeName</th>
                              <th>Age</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PendingcurrentItems.length > 0 ? PendingcurrentItems.map(items => (
                              <tr key={items.ID}>
                                {/* <td>
                                  <a href={'#/ViewVehicle/' + items.ID}>
                                    <Icon iconName='View' style={{ cursor: 'pointer' }} title='View' />
                                  </a>
                                  {items.Status === "Pending" &&
                                    <a href={'#/UserApproveVehicle/' + items.ID}>
                                      <Icon iconName='CheckMark' title='Approve' style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                    </a>
                                  }
                                </td> */}

                                <td>
                                  <a href={'#/ViewVehicle/' + items.ID}>
                                    <Icon iconName='View' style={{ cursor: 'pointer' }}
                                      title='View' />
                                  </a>
                                  {
                                    items.Status === "Draft" &&
                                    <a href={'#/EditVehicle/' + items.ID}>
                                      <Icon iconName='Edit' title='Edit' style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                    </a>
                                  }
                                </td>

                                <td>{items.Title}</td>
                                <td>{items.EmployeeCode}</td>
                                <td>{items.EmployeeName}</td>
                                <td>{items.Age}</td>
                                <td>{items.Status}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#888' }}>
                                  No Data Available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {/* <div style={{ marginTop: '10px' }}>
                          <button onClick={() => this.PendinghandlePageChange('prev')} disabled={currentPage === 1}>Prev</button>
                          <span style={{ margin: '0 10px' }}>Page {currentPage} of {this.PendingpageCount()}</span>
                          <button onClick={() => this.PendinghandlePageChange('next')} disabled={currentPage === this.PendingpageCount()}>Next</button>
                        </div> */}

<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
  <button
    onClick={() => this.PendinghandlePageChange('prev')}
    disabled={this.state.currentPage === 1}
    style={{ padding: '6px 12px', margin: '0 4px', cursor: this.state.currentPage === 1 ? 'not-allowed' : 'pointer' }}
  >
    Prev
  </button>

  {(() => {
    const totalPages = this.PendingpageCount();
    const currentPage = this.state.currentPage;
    const pageLimit = 5;
    const currentGroup = Math.floor((currentPage - 1) / pageLimit);
    const startPage = currentGroup * pageLimit + 1;
    const endPage = Math.min(startPage + pageLimit - 1, totalPages);

    const pages = [];
    if (startPage > 1) {
      pages.push(
        <button
          key="prev-ellipsis"
          onClick={() => this.PendinghandlePageClick(startPage - 1)}
          style={{ padding: '6px 12px', margin: '0 4px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          ...
        </button>
      );
    }

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      pages.push(
        <button
          key={pageNum}
          onClick={() => this.PendinghandlePageClick(pageNum)}
          style={{
            padding: '6px 12px',
            margin: '0 4px',
            backgroundColor: currentPage === pageNum ? '#007bff' : '#f0f0f0',
            color: currentPage === pageNum ? '#fff' : '#000',
            border: '1px solid #ccc',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          {pageNum}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <button
          key="next-ellipsis"
          onClick={() => this.PendinghandlePageClick(endPage + 1)}
          style={{ padding: '6px 12px', margin: '0 4px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          ...
        </button>
      );
    }

    return pages;
  })()}

  <button
    onClick={() => this.PendinghandlePageChange('next')}
    disabled={this.state.currentPage === this.PendingpageCount()}
    style={{ padding: '6px 12px', margin: '0 4px', cursor: this.state.currentPage === this.PendingpageCount() ? 'not-allowed' : 'pointer' }}
  >
    Next
  </button>
</div>




                      </div>
                    )}


                    {this.state.activeTab == 'Approved' && (
                      <div id="Approved" className="tabcontent">
                        <h3>Approved</h3>

                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={this.ApprovedhandleSearch}
                          style={{ marginBottom: '10px', padding: '5px' }}
                        />
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Action</th>
                              <th>VM ID</th>
                              <th>EmployeeID</th>
                              <th>EmployeeName</th>
                              <th>Age</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ApprovedcurrentItems.length > 0 ? ApprovedcurrentItems.map(items => (
                              <tr key={items.ID}>
                                <td>
                                  <a href={'#/ViewVehicle/' + items.ID}>
                                    <Icon iconName='View' style={{ cursor: 'pointer' }} title='View' />
                                  </a>
                                  {/* {items.Status === "Pending" &&
                                    <a href={'#/UserApproveVehicle/' + items.ID}>
                                      <Icon iconName='CheckMark' title='Approve' style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                    </a>
                                  } */}
                                </td>
                                <td>{items.Title}</td>
                                <td>{items.EmployeeCode}</td>
                                <td>{items.EmployeeName}</td>
                                <td>{items.Age}</td>
                                <td>{items.Status}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#888' }}>
                                  No Data Available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {/* <div style={{ marginTop: '10px' }}>
                          <button onClick={() => this.ApprovedhandlePageChange('prev')} disabled={currentPage === 1}>Prev</button>
                          <span style={{ margin: '0 10px' }}>Page {currentPage} of {this.ApprovedpageCount()}</span>
                          <button onClick={() => this.ApprovedhandlePageChange('next')} disabled={currentPage === this.ApprovedpageCount()}>Next</button>
                        </div> */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
  <button
    onClick={() => this.ApprovedhandlePageChange('prev')}
    disabled={this.state.currentPage === 1}
    style={{ padding: '6px 12px', margin: '0 4px', cursor: this.state.currentPage === 1 ? 'not-allowed' : 'pointer' }}
  >
    Prev
  </button>

  {(() => {
    const totalPages = this.ApprovedpageCount();
    const currentPage = this.state.currentPage;
    const pageLimit = 5;
    const currentGroup = Math.floor((currentPage - 1) / pageLimit);
    const startPage = currentGroup * pageLimit + 1;
    const endPage = Math.min(startPage + pageLimit - 1, totalPages);

    const pages = [];
    if (startPage > 1) {
      pages.push(
        <button
          key="prev-ellipsis"
          onClick={() => this.ApprovedhandlePageClick(startPage - 1)}
          style={{ padding: '6px 12px', margin: '0 4px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          ...
        </button>
      );
    }

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      pages.push(
        <button
          key={pageNum}
          onClick={() => this.ApprovedhandlePageClick(pageNum)}
          style={{
            padding: '6px 12px',
            margin: '0 4px',
            backgroundColor: currentPage === pageNum ? '#007bff' : '#f0f0f0',
            color: currentPage === pageNum ? '#fff' : '#000',
            border: '1px solid #ccc',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          {pageNum}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <button
          key="next-ellipsis"
          onClick={() => this.ApprovedhandlePageClick(endPage + 1)}
          style={{ padding: '6px 12px', margin: '0 4px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          ...
        </button>
      );
    }

    return pages;
  })()}

  <button
    onClick={() => this.ApprovedhandlePageChange('next')}
    disabled={this.state.currentPage === this.ApprovedpageCount()}
    style={{ padding: '6px 12px', margin: '0 4px', cursor: this.state.currentPage === this.ApprovedpageCount() ? 'not-allowed' : 'pointer' }}
  >
    Next
  </button>
</div>

                      </div>
                    )}
                    {this.state.activeTab == 'Rejected' && (
                      <div id="Rejected" className="tabcontent">
                        <h3>Rejected</h3>

                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={this.RejectedhandleSearch}
                          style={{ marginBottom: '10px', padding: '5px' }}
                        />
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Action</th>
                              <th>VM ID</th>
                              <th>EmployeeID</th>
                              <th>EmployeeName</th>
                              <th>Age</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {RejectedcurrentItems.length > 0 ? RejectedcurrentItems.map(items => (
                              <tr key={items.ID}>
                                <td>
                                  <a href={'#/ViewVehicle/' + items.ID}>
                                    <Icon iconName='View' style={{ cursor: 'pointer' }} title='View' />
                                  </a>
                                  {/* {items.Status === "Pending" &&
                                    <a href={'#/UserApproveVehicle/' + items.ID}>
                                      <Icon iconName='CheckMark' title='Approve' style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                    </a>
                                  } */}
                                </td>
                                <td>{items.Title}</td>
                                <td>{items.EmployeeCode}</td>
                                <td>{items.EmployeeName}</td>
                                <td>{items.Age}</td>
                                <td>{items.Status}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#888' }}>
                                  No Data Available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
  <button
    onClick={() => this.RejectedhandlePageChange('prev')}
    disabled={this.state.currentPage === 1}
    style={{ padding: '6px 12px', margin: '0 4px', cursor: this.state.currentPage === 1 ? 'not-allowed' : 'pointer' }}
  >
    Prev
  </button>

  {(() => {
    const totalPages = this.RejectedpageCount();
    const currentPage = this.state.currentPage;
    const pageLimit = 5;
    const currentGroup = Math.floor((currentPage - 1) / pageLimit);
    const startPage = currentGroup * pageLimit + 1;
    const endPage = Math.min(startPage + pageLimit - 1, totalPages);

    const pages = [];
    if (startPage > 1) {
      pages.push(
        <button
          key="prev-ellipsis"
          onClick={() => this.RejectedhandlePageClick(startPage - 1)}
          style={{ padding: '6px 12px', margin: '0 4px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          ...
        </button>
      );
    }

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      pages.push(
        <button
          key={pageNum}
          onClick={() => this.RejectedhandlePageClick(pageNum)}
          style={{
            padding: '6px 12px',
            margin: '0 4px',
            backgroundColor: currentPage === pageNum ? '#007bff' : '#f0f0f0',
            color: currentPage === pageNum ? '#fff' : '#000',
            border: '1px solid #ccc',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          {pageNum}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <button
          key="next-ellipsis"
          onClick={() => this.RejectedhandlePageClick(endPage + 1)}
          style={{ padding: '6px 12px', margin: '0 4px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          ...
        </button>
      );
    }

    return pages;
  })()}

  <button
    onClick={() => this.RejectedhandlePageChange('next')}
    disabled={this.state.currentPage === this.RejectedpageCount()}
    style={{ padding: '6px 12px', margin: '0 4px', cursor: this.state.currentPage === this.RejectedpageCount() ? 'not-allowed' : 'pointer' }}
  >
    Next
  </button>
</div>

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
}