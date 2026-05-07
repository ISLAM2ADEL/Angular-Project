export interface Movie {
  _id: string;
  title: string;
  description: string;
  duration: number;
  genre: string[];
  rating: string;
  language: string;
  poster: string;
  releaseDate: string;
  isNowShowing: boolean;
  showTimes?: string[];
}

export interface Hall {
  _id: string;
  name: string;
  totalSeats: number;
  type: string;
}

export interface ShowtimeSeat {
  id: string;
  isReserved: boolean;
}

export interface ShowtimeListItem {
  _id: string;
  price: number;
  startTime: string;
  hallId: Hall | string;
  movie: Movie | string;
  seats?: ShowtimeSeat[];
}

export interface ShowtimeDetail extends ShowtimeListItem {
  seats: ShowtimeSeat[];
}

export interface SeatUi {
  id: string;
  isTaken: boolean;
}
