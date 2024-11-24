import { Component, Input } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";



@Component({
    selector: 'app-question-validation',
    templateUrl: './question-validation.component.html'
  })
  export class QuestionValidationComponent {

    @Input() quizForm!: FormGroup;



    constructor(private fb: FormBuilder) {}



    createQuestion(): FormGroup {
        return this.fb.group({
          order: [],
          body: ['', [Validators.required, Validators.minLength(3)]],
          solutions: this.fb.array([], [Validators.required])
        })
      }
    

    
    
      addQuestion(): void {
        this.questionArray.push(this.createQuestion());
      }
    

    
    
      removeQuestion(questionIndex: number) {
        this.questionArray.removeAt(questionIndex);
      }
    
    
    
    
      moveQuestion(questionIndex: number, val: number) {
        let question = this.questionArray.at(questionIndex);
        this.questionArray.removeAt(questionIndex);
        this.questionArray.insert((questionIndex + val), question);
      }
    
    


      getQuestion(index: number): FormGroup {
        return this.questionArray.at(index) as FormGroup;
      }
    


      get questionArray() {
        return this.quizForm!.get("questions") as FormArray;
      }







    getTopError() {
        if (this.questionArray.hasError('required'))
          return 'No questions.';
    
        const questionErrors = this.questionArray.controls
          .map((question, index) => this.getErrors(question, index))
          .filter(error => !!error);
    
        if (questionErrors.length > 0)
          return questionErrors[0];
    
        return "";
      }
    
    
    
      private getErrors(question: AbstractControl, index: number): string | null {
        if (question.hasError('required', 'body'))
          return `Body is required for question ${index + 1}.`;
    
        if (question.hasError('minlength', 'body'))
          return `Body length must have at least 3 characters for question ${index + 1}.`;
    
        if (question.hasError('required', 'solutions'))
          return `At least 1 solution is required for question ${index + 1}.`;
    
        const solutionErrors = this.getSolutionErrors(question, index);
    
        if (solutionErrors.length > 0)
          return solutionErrors[0];
    
        return null;
      }
    
    
    
      private getSolutionErrors(question: AbstractControl, questionIndex: number) {
        return (question.get('solutions') as FormArray).controls
          .map((solution, solutionIndex) => {
    
            if (solution.hasError('required', 'sql'))
              return `SQL is required for solution ${solutionIndex + 1} of question ${questionIndex + 1}.`;
    
            if (solution.hasError('minlength', 'sql'))
              return `SQL must have at least 3 characters for solution ${solutionIndex + 1} of question ${questionIndex + 1}.`;
    
            return null;
          })
          .filter(error => !!error);
      }
    
    

  }