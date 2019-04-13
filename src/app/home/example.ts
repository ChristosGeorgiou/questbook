export enum DocType {
  campaign,
  story,
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
  owner: string;
  description: string;
  text: string;
}

export interface Story extends Data {
  label: string;
  text: string;
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
  Story |
  Monster |
  Character |
  Item |
  Map;

export interface Doc {
  _id: string;
  ts: number;
  show: boolean;
  type: DocType;
  campaign?: number;
  data: DocData;
}

export const example: Doc[] = [{
  _id: 'some-id-1',
  ts: 1554805619000,
  type: DocType.campaign,
  show: false,
  data: {
    title: 'My First Campaign',
    owner: 'You ❤ DM',
    description: 'hack & slash',
    text: 'lorem ipsum dolor'
  }
}, {
  _id: 'some-id-2',
  ts: 1554805784000,
  type: DocType.story,
  campaign: 1554805619000,
  show: false,
  data: {
    label: 'Example info text',
    text: 'lorem **ipsum** dolor\n\n- t1\n- t2'
  }
}, {
  _id: 'some-id-3',
  ts: 1554805784000,
  type: DocType.monster,
  campaign: 1554805619000,
  show: false,
  data: {
    name: 'Dragon',
    description: 'A dragon is a large, serpent-like legendary creature that appears in the folklore of many cultures around the world. Beliefs about dragons vary drastically by region, but dragons in western cultures since the High Middle Ages have often been depicted as winged, horned, four-legged, and capable of breathing fire. Dragons in eastern cultures are usually depicted as wingless, four-legged, serpentine creatures with above-average intelligence.',
    notes: 'dm notes here',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCP_FT3w8gFj7oOToFcS4GiPlUDCVVcptnmesYoByCKSu-fcdS',
    portrait: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjczJGsg8ThAhXO0KQKHdY0DCoQjRx6BAgBEAU&url=%2Furl%3Fsa%3Di%26source%3Dimages%26cd%3D%26ved%3D%26url%3Dhttps%253A%252F%252Fwww.youtube.com%252Fwatch%253Fv%253DOSI102cY3sE%26psig%3DAOvVaw3RV3IyqwPvXp-17tAXfQUH%26ust%3D1554934175798173&psig=AOvVaw3RV3IyqwPvXp-17tAXfQUH&ust=1554934175798173'
  }
}, {
  _id: 'some-id-4',
  ts: 1554805784000,
  type: DocType.character,
  campaign: 1554805619000,
  show: false,
  data: {
    name: 'John Smith',
    description: 'lorem ipsum dolor',
    notes: 'dm notes here',
    thumb: 'https://picsum.photos/200/200',
    portrait: 'https://picsum.photos/500/600'
  }
}, {
  _id: 'some-id-5',
  ts: 1554805784000,
  type: DocType.item,
  campaign: 1554805619000,
  show: false,
  data: {
    name: 'example item',
    description: 'lorem ipsum dolor',
    notes: 'dm notes here',
    thumb: 'https://picsum.photos/200/200',
    picture: 'https://picsum.photos/400/400'
  }
}, {
  _id: 'some-id-6',
  ts: 1554805784000,
  type: DocType.map,
  campaign: 1554805619000,
  show: false,
  data: {
    label: 'Example Map 01',
    description: 'lorem ipsum dolor',
    notes: 'dm notes here',
    thumb: 'https://picsum.photos/200/200',
    map: 'https://picsum.photos/2000/2000',
    mask: 'https://picsum.photos/2000/2000',
    poi: [
      {
        x: 100,
        y: 100,
        description: 'lorem ipsum dolor',
        notes: 'dm notes here'
      }
    ]
  }
} ];
