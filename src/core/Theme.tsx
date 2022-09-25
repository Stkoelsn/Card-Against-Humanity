
export type ThemeConfig = {
  name: string;
  value: string;
}
export let Themes: { [key: string]: ThemeConfig[] } = {};

Themes['light'] = [{ name: '--main-color', value: '#cccccc' },
{ name: '--fore-color', value: '#262626' },
{ name: '--background-color-1', value: '#DECDF5' },
{ name: '--background-color-2', value: '#A99CE1' },
{ name: '--background-color-3', value: '#23a6d5' },
{ name: '--background-color-4', value: '#23d5ab' },
];


Themes['dark'] = [{ name: '--main-color', value: '#262626' },
{ name: '--fore-color', value: '#cccccc' },
{ name: '--background-color-1', value: '#1D5346' },
{ name: '--background-color-2', value: '#163B49' },
{ name: '--background-color-3', value: '#2A0054' },
{ name: '--background-color-4', value: '#679436' },
];