import '../services/Utilities/customTheme'
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'VehicleModuleWebPartStrings';
import VehicleModule from './components/VehicleModule';
import { IVehicleModuleProps } from './components/IVehicleModuleProps';
export interface IVehicleModuleWebPartProps {
  description: string;
}
export default class VehicleModuleWebPart extends BaseClientSideWebPart<IVehicleModuleWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IVehicleModuleProps > = React.createElement(
      VehicleModule,
      {
        description: this.properties.description,
        currentSPContext: this.context
      }
    );
    ReactDom.render(element, this.domElement);
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
