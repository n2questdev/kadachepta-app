export class RadioItem {
    constructor(title: string, artist: string, description: string, picture: string) {
        this.title = title;
        this.artist = artist;
        this.description = description;
        this.picture = picture;
    }

    title: string;
    artist: string;
    description: string;
    picture: string;
}