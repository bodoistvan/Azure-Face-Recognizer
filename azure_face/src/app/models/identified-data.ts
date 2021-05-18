export interface IdentifiedData {
    faceId: string;
    candidates: {
        personId: string;
        confidence: number;
    }[]
}
