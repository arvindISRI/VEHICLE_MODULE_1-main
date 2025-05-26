import * as React from 'react';
import { Nav, INavLink, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { IVehicleModuleProps } from '../IVehicleModuleProps';
import useSPCRUD from '../../../services/bal/spcrud';

interface ITopNavigation {
  selectedLink: string;
  ShowHR1Tab: boolean;
  ShowHR2Tab: boolean;
  ShowGHTab: boolean;
}

export default class Navigation extends React.Component<IVehicleModuleProps, ITopNavigation> {
  constructor(props) {
    super(props);

    const currHashPath = window.location.hash;
    const selected = currHashPath.split('/')[1] || 'UserDash';

    this.state = {
      selectedLink: selected,
      ShowHR1Tab: false,
      ShowHR2Tab: false,
      ShowGHTab: false,
    };

    this.onNavLinkClick = this.onNavLinkClick.bind(this);
  }

  public onNavLinkClick(ev?: React.MouseEvent<HTMLElement>, link?: INavLink): void {
    if (link && link.key) {
      localStorage.removeItem('activeTab');
      localStorage.setItem('activeTab', 'Pending');
      this.setState({ selectedLink: link.key });
    }
  }

  async componentDidMount() {
    await this.checkUserInGroupsForHR1Tab(["HR1_Group"]);
    await this.checkUserInGroupsForHR2Tab(["HR2_Group"]);
    await this.checkUserInGroupsForGHTab(["GROUPHEAD"]);
  }

  public async checkUserInGroupsForHR1Tab(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        this.setState({ ShowHR1Tab: true });
      }
    } catch (error) {
      console.error("Error checking HR1 groups:", error);
    }
  }

  public async checkUserInGroupsForHR2Tab(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        this.setState({ ShowHR2Tab: true });
      }
    } catch (error) {
      console.error("Error checking HR2 groups:", error);
    }
  }

  public async checkUserInGroupsForGHTab(groups: any) {
    try {
      const spCrudObj = await useSPCRUD();
      const userGroups = await spCrudObj.currentUserGroup(this.props);
      const isUserInGroup = userGroups.some(group => groups.includes(group.Title));
      if (isUserInGroup) {
        this.setState({ ShowGHTab: true });
      }
    } catch (error) {
      console.error("Error checking GroupHead groups:", error);
    }
  }

  public render(): React.ReactElement<any> {
    const navLinks: INavLink[] = [
      {
        name: 'User Dashboard',
        url: '#/',
        iconProps: { iconName: 'ContactInfo' },
        key: 'UserDash'
      },
      ...(this.state.ShowGHTab ? [{
        name: 'Group Head Dashboard',
        url: '#/GroupHeadDashboard',
        iconProps: { iconName: 'WorkFlow' }, 
        key: 'GroupHeadDashboard'
      }] : []),
      ...(this.state.ShowHR1Tab ? [{
        name: 'HR1 Dashboard',
        url: '#/HR1Dashboard',
        iconProps: { iconName: 'WorkFlow' },
        key: 'HR1Dashboard'
      }] : []),
      ...(this.state.ShowHR2Tab ? [{
        name: 'HR2 Dashboard',
        url: '#/HR2Dashboard',
        iconProps: { iconName: 'WorkFlow' },
        key: 'HR2Dashboard'
      }] : []),
   
    ];

    return (
      <div>
        <Nav
          onLinkClick={this.onNavLinkClick}
          selectedKey={this.state.selectedLink}
          className='emp-mas-top-nav'
          groups={[{ links: navLinks }]}
        />
      </div>
    );
  }
}
