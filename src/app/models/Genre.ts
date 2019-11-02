export class Genre {
    constructor(name: string, picture?: string) {
        this.name = name;
        this.picture = picture;
    }

    genreId: string;
    name: string;
    picture: string;
}
