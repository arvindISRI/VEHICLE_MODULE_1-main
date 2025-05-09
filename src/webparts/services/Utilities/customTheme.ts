import { createTheme, ITheme, loadTheme } from 'office-ui-fabric-react/lib/Styling'
const customPartialTheme = {
    palette: {
        'themePrimary': '#faa21a',
        'themeLighterAlt': '#fffbf6',
        'themeLighter': '#fef0da',
        'themeLight': '#fde2b9',
        'themeTertiary': '#fcc674',
        'themeSecondary': '#fbab34',
        'themeDarkAlt': '#e19016',
        'themeDark': '#be7a13',
        'themeDarker': '#8c5a0e',
        'neutralLighterAlt': '#f8f8f8',
        'neutralLighter': '#f4f4f4',
        'neutralLight': '#eaeaea',
        'neutralQuaternaryAlt': '#dadada',
        'neutralQuaternary': '#d0d0d0',
        'neutralTertiaryAlt': '#c8c8c8',
        'neutralTertiary': '#7f9bc0',
        'neutralSecondary': '#5e80ab',
        'neutralPrimaryAlt': '#426797',
        'neutralPrimary': '#001e46',
        'neutralDark': '#183d6e',
        'black': '#0a2c59',
        'white': '#fff',
        'primaryBackground': '#fff',
        'primaryText': '#001e46',
        'bodyBackground': '#fff',
        'bodyText': '#001e46',
        'disabledBackground': '#f4f4f4',
        'disabledText': '#c8c8c8'
    }
};
const customTheme: ITheme = createTheme(customPartialTheme);
loadTheme(customTheme);
let link: HTMLLinkElement = document.querySelector("link[id~='favicon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.type = 'image/vnd.microsoft.icon'
    document.getElementsByTagName('head')[0].appendChild(link);
}
link.href = '../../../SiteAssets/EximHome/Images/EximIcon.png';