import { Survivor } from './survivor';

export class Report {
  id: string;
  survivor: Survivor;
  reporter: Survivor;
  createdAt: Date;
}
