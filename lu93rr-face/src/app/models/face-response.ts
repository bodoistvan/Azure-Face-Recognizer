export interface FaceResponse {
    faceId: string
    name?: string
    faceRectangle: {
      top: number,
      left: number,
      width: number,
      height: number
    },
    faceAttributes: {
      smile: number,
      gender: string,
      age: number,
      glasses: string,
      makeup: {
        eyeMakeup: boolean,
        lipMakeup: boolean
      },
    },
}
