import { Injectable } from "@angular/core";
import { MatTableState } from "../helpers/mattable.state";

@Injectable({ providedIn: 'root' })
export class StateService {
    public trainingQuizzesState = new MatTableState('nom', 'asc', 5);
    public testQuizzesState = new MatTableState('nom', 'asc', 5);
    public teacherQuizzesState = new MatTableState('nom', 'asc', 10);

    public restartQuiz: boolean = false;
}
