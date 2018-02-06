export interface Pin {
  comments: [{
    id: string,
    pinId: string,
    content: string,
    liked: boolean,
    likeCount: number,
    user: {
      uid: string,
      name: string,
      photo: string,
    },
    timestamp: {
      rawdate: number,
      displayDate: string,
      rawTime: number,
      displayTime: string,
    }
  }],
  likers: [{
    id: string,
    pinId: string,
    user: {
      uid: string,
      name: string,
      photo: string,
    },
    timestamp: {
      rawdate: number,
      displayDate: string,
      rawTime: number,
      displayTime: string,
    }
  }],
  id: string,
  title: string,
  content: string,
  flagged: boolean,
  liked: boolean,
  likeCount: number,
  commentCount: number,
  media: {
    image: boolean,
    audio: boolean,
    video: boolean
  },
  mediaUrl: string,
  user: {
    uid: string,
    name: string,
    photo: string,
  },
  timestamp: {
    rawDate: number,
    displayDate: string,
    rawTime: number,
    displayTime: string,
  }
}

