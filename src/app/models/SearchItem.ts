import { SearchItemType } from './SearchItemType';

export class SearchItem {
    id: string;
    name: string;
    description: string;
    picture: string;
    searchItemType: SearchItemType;
    isPlaying: boolean;
}
