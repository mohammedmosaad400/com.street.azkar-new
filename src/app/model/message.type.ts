export interface Message {
  id: number;
  date: string; //for iso time (use for input not use for show)
  time: string; //for my translated time (only for show)
  is_read: boolean;
  text: string;
  isOwner: boolean;
}
