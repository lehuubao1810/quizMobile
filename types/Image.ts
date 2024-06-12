


export type Image = {
    assetId: string;
    base64: string | null;
    duration: number | null;
    exif: string | null;
    fileName: string;
    fileSize: number;
    height: number;
    type: string;
    uri: string;
    width: number;
}

export type Images = {
    assets: Image[];
    canceled: boolean;
} | null


