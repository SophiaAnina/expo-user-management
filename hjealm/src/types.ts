/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 */

export interface Options {
  face?: (
    | 'eyes8'
    | 'eyes9'
    | 'eyes10'
    | 'eyes11'
    | 'eyes12'
    | 'eyes1'
    | 'eyes2'
    | 'eyes3'
    | 'eyes4'
    | 'eyes5'
    | 'eyes6'
    | 'eyes7'
    | 'hjealm'
  )[];
  faceColor?: string[];
}

export type ColorPickCollection = Record<string, string>;

export type ComponentGroup = Record<string, ComponentGroupItem>;
export type ComponentGroupCollection = Record<string, ComponentGroup>;
export type ComponentGroupItem = (
  components: ComponentPickCollection,
  colors: ColorPickCollection
) => string;
export type ComponentPickCollection = Record<string, ComponentPick>;
export type ComponentPick =
  | {
      name: string;
      value: ComponentGroupItem;
    }
  | undefined;
