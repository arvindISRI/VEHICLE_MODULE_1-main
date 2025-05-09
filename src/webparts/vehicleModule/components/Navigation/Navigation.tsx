import * as  React from 'react';
import {
    PrimaryButton, DefaultButton
} from 'office-ui-fabric-react';
import styles from '../VehicleModule.module.scss'
import { Nav, INavLink, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
// import BlockReleaseRequestOps from '../../services/bal/blockreleaserequest';
import { IVehicleModuleProps } from '../IVehicleModuleProps';
import useSPCRUD, { ISPCRUD } from '../../../services/bal/spcrud';
interface ITopNavigation {
    selectedLink: string;
    // ShowHR2Tab:any,
    // ShowHR1Tab:any,
    // ShowGHTab:any,
}
export default class Navigation extends React.Component<IVehicleModuleProps, ITopNavigation> {
    constructor(props) {
        super(props);
        let currHashPath = window.location.hash;
        if (currHashPath.split('/')[1])
        {
            this.state = { selectedLink: currHashPath.split('/')[1] };
        }
        else {
            this.state = { selectedLink: 'UserDash' };
        }
        this.onNavLinkClick = this.onNavLinkClick.bind(this);
    }
    public onNavLinkClick(ev?: React.MouseEvent<HTMLElement>, link?: INavLink): void {
        if (link && link.key) {
            //console.log('Clicked PivotItem:', item['props']['itemKey']);
            this.setState({ selectedLink: link.key });
        }        
    }
    async componentDidMount() {
        // await this.checkUserInGroups(["HR1_Group", "HR2_Group","GROUPHEAD"]);
        await this.checkUserInGroupsForHR1Tab(["HR1_Group"]);
        await this.checkUserInGroupsForHR2Tab(["HR2_Group"]);
        await this.checkUserInGroupsForHR2Tab(["GROUPHEAD"]);
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
            //   this.setState({ ShowHR2Tab: true })
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
            //   this.setState({ ShowHR1Tab: true })
            }
          } catch (error) {
            console.error("Error checking user in groups:", error);
            return false;
          }
        }
    public render(): React.ReactElement<any> {
        // return (
        //     <div id='divNav'>
        //         <Nav
        //             expandButtonAriaLabel="Expand or collapse"
        //             ariaLabel="Nav basic example"
        //             className='emp-mas-top-nav'
        //             // onRenderLink={this._onRenderLink}
        //             groups={
        //                 [
        //                     {
        //                         links: [
        //                             {
        //                                 name: 'User Dashboard',
        //                                 url: '#/', 
        //                                 key: 'lnkMyRequest',
        //                                 iconProps: { iconName: 'UserFollowed' }
        //                             },
        //                             {
        //                                 name: 'Approver Dashboard',
        //                                 url: '#/ApproverDashboard',
        //                                 key: 'lnkActReq',
        //                                 iconProps: { iconName: 'DocumentApproval'}
        //                             },
        //                             {
        //                                 name: 'Reference Document',
        //                                 url: '#/ReferenceDocDashboard',
        //                                 key: 'lnkViewDocument',
        //                                 iconProps: { iconName: 'DownloadDocument'}
        //                             },
        //                         ]
        //                     }
        //                 ]}
        //         />
        //     </div>
        // );
        return (
            <div>
                <Nav onLinkClick={this.onNavLinkClick} className='emp-mas-top-nav' groups={[{
                    links: [
                        {
                            name: 'User Dashboard', url: '#/', icon: 'ContactInfo', key: 'UserDash'
                        },
                        {
                            name: 'HR1  Dashboard', url: '#/HR1Dashboard', iconProps: { iconName: 'WorkFlow' }, key: 'HR1Dashboard'
                        },
                        {
                            name: 'HR2  Dashboard', url: '#/HR2Dashboard', iconProps: { iconName: 'WorkFlow' }, key: 'HR2Dashboard'
                        },
                        {
                            name: 'Group Head  Dashboard', url: '#/GroupHeadDashboard', iconProps: { iconName: 'WorkFlow' }, key: 'GroupHeadDashboard'
                        },
                    ]
                }]}
                    selectedKey={this.state.selectedLink}
                />
            </div>
        );
    }
}
