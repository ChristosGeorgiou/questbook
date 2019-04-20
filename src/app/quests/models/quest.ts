export interface Quest {
    subject?: string;
    description?: string;
    visible: number;
    items: {
        content?: string,
        visible: number
    }[];
}
