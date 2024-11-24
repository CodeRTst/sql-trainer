import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";



@Component({
    selector: 'app-solution-validation',
    templateUrl: './solution-validation.component.html'
})
export class SolutionValidationComponent {

    @Input() questionForm!: FormGroup;



    constructor(private fb: FormBuilder) { }



    createSolution(): FormGroup {
        return this.fb.group({
            order: [],
            sql: ['', [Validators.required, Validators.minLength(3)]]
        })
    }



    addSolution(): void {
        this.solutions.push(this.createSolution());
    }



    removeSolution(solutionIndex: number) {
        this.solutions.removeAt(solutionIndex);
    }


    moveSolution(solutionIndex: number, val: number) {
        let solution = this.solutions.at(solutionIndex);

        this.solutions.removeAt(solutionIndex);
        this.solutions.insert((solutionIndex + val), solution);
    }




    get solutions(): FormArray {
        return this.questionForm.get('solutions') as FormArray;
    }

}

