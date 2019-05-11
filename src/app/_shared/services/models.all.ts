export enum CampaignDocType {
  campaign,
  quest,
  monster,
  character,
  item,
  map,
}

export type CampaignDocData = CampaignData | QuestData | MonsterData | CharacterData | ItemData | MapData;

export interface CampaignDoc {
  _id?: string;
  created: number;
  type: CampaignDocType;
  data: CampaignDocData;
  files: any;
}

export interface BaseData {
  description?: string;
  visible?: number;
  items?: {
    content?: string,
    visible?: number
  }[];
}

export interface CampaignData extends BaseData {
  title: string;
  owner?: string;
  text?: string;
}

export interface QuestData extends BaseData {
  subject?: string;
}

export interface MonsterData extends BaseData {
  name: string;
  description: string;
  notes: string;
  thumb: string;
}

export interface CharacterData extends BaseData {
  name?: string;
}

export interface ItemData extends BaseData {
  name: string;
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
  notes: string;
  thumb: string;
  map: string;
  mask: string;
  poi: MapPOI[];
}

export interface Preferences {
  isMaster?: boolean;
}

export interface Refereable {
  _id?: string;
}

export interface Character extends CharacterData, Refereable {
  portrait?: string;
}

export interface Quest extends QuestData, Refereable {
}
