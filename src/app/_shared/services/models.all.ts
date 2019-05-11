export enum DocType {
  campaign,
  quest,
  monster,
  character,
  item,
  map,
}

export interface BaseModel {
  files?: any;
  ref?: string;
}

export interface BaseData {
  displayedAt?: number;
}

export interface CampaignData extends BaseData {
  title: string;
  owner?: string;
  description?: string;
  text?: string;
}

export interface QuestData extends BaseData {
  subject?: string;
  description?: string;
  visible?: number;
  items: {
    content?: string,
    visible?: number
  }[];
}
export interface MonsterData extends BaseData {
  name: string;
  description: string;
  notes: string;
  thumb: string;
}

export interface CharacterData extends BaseData {
  name?: string;
  description?: string;
  visible?: number;
  items: {
    content?: string,
    visible?: number
  }[];
}

export interface ItemData extends BaseData {
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

export interface MapData extends BaseData {
  label: string;
  description: string;
  notes: string;
  thumb: string;
  map: string;
  mask: string;
  poi: MapPOI[];
}

export type DocData =
  CampaignData |
  QuestData |
  MonsterData |
  CharacterData |
  ItemData |
  MapData;

export interface Doc {
  _id?: string;
  ts: number;
  type: DocType;
  data: DocData;
}

export interface Preferences {
  isMaster?: boolean;
}

export interface Character extends CharacterData, BaseModel {
  portrait?: string;
}

export interface Quest extends QuestData, BaseModel {
}
