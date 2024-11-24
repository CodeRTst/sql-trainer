import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-confirmation-dialog',
    template: `
      <h2 mat-dialog-title>Clotûrer ce quiz</h2>
      <mat-dialog-content>{{ data }}</mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Non</button>
        <button mat-button (click)="onYesClick()">Oui</button>
      </mat-dialog-actions>
    `,
  })
  export class DeleteQuizDialogComponent {
    constructor(
      public dialogRef: MatDialogRef<DeleteQuizDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    message: string = '';
  
    onNoClick(): void {
      this.dialogRef.close('no');
    }
  
    onYesClick(): void {
      this.dialogRef.close('yes');
    }
  }