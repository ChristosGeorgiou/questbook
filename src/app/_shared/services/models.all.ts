export enum DocType {
  campaign,
  quest,
  monster,
  character,
  item,
  map,
}

export interface Data {
  displayedAt?: number;
}

export interface Campaign extends Data {
  title: string;
  owner?: string;
  description?: string;
  text?: string;
}

export interface Quest extends Data {
  subject?: string;
  description?: string;
  visible: number;
  items: {
      content?: string,
      visible: number
  }[];
}

export interface Monster extends Data {
  name: string;
  description: string;
  notes: string;
  thumb: string;
  portrait: string;
}

export interface Character extends Data {
  name: string;
  description: string;
  notes: string;
  thumb: string;
  portrait: string;
}

export interface Item extends Data {
  name: string;
  description: string;
  notes: string;
  thumb: string;
  picture: string;
}

export interface MapPOI {
  x: number;
  y: number;
  description: string;
  notes: string;
}

export interface Map extends Data {
  label: string;
  description: string;
  notes: string;
  thumb: string;
  map: string;
  mask: string;
  poi: MapPOI[];
}

export type DocData =
  Campaign |
  Quest |
  Monster |
  Character |
  Item |
  Map;

export interface Doc {
  _id?: string;
  ts: number;
  type: DocType;
  data: DocData;
}

export interface Preferences {
  isMaster?: boolean;
}

export interface Referable {
  ref?: string;
}
