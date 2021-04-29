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
      headPose: {
        pitch: number,
        roll: number,
        yaw: number
      },
      gender: string,
      age: number,
      facialHair: {
        moustache: number,
        beard: number,
        sideburns: number
      },
      glasses: string,
      emotion: {
        anger: number,
        contempt: number,
        disgust: number,
        fear: number,
        happiness: number,
        neutral: number,
        sadness: number,
        surprise: number
      },
      blur: {
        blurLevel: string,
        value: number
      },
      exposure: {
        exposureLevel: string,
        value: number
      },
      noise: {
        noiseLevel: string,
        value: number
      },
      makeup: {
        eyeMakeup: boolean,
        lipMakeup: boolean
      },
      accessories: [
        {
          type: string,
          confidence: number
        }
      ],
      occlusion: {
        foreheadOccluded: boolean,
        eyeOccluded: boolean,
        mouthOccluded: boolean
      },
      hair: {
        bald: number,
        invisible: boolean,
        hairColor: [
          {
            color: string,
            confidence: number
          },
          {
            color: string,
            confidence: number
          },
          {
            color: string,
            confidence: number
          },
          {
            color: string,
            confidence: number
          },
          {
            color: string,
            confidence: number
          },
          {
            color: string,
            confidence: number
          },
          {
            color: string,
            confidence: number
          }
        ]
      }
    },
    recognitionModel: string
}
