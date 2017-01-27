import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { PianoNote } from './piano-note';
import { QuizResult } from './quiz-result';
import { QuizStatus } from './quiz-status.enum';

@Injectable()
export class PianoQuizService {

  private quizLength = 16;
  private quizNotes: string[] = [];
  private quizResults: QuizResult[] = [];
  private quizIndex = 0;

  inProgress: boolean = false;
  score: number = 0;
  status: QuizStatus = QuizStatus.None;

  // Observable sources
  private pianoQuizResultSource = new Subject<QuizResult>();

  // Observable streams
  quizResult$ = this.pianoQuizResultSource.asObservable();

  constructor() {
  }

  initQuiz(quizLength: number, availableNotes: string[]) {

    this.quizLength = quizLength;

    // clear quiz data
    this.quizNotes.length = 0;
    this.quizResults.length = 0;

    this.inProgress = true;
    this.quizIndex = 0;
    this.score = 0;

    // generate random notes from the availableNotes array
    for(let i=0;i<this.quizLength;i++) {
      this.quizNotes.push( availableNotes[Math.floor(Math.random()* availableNotes.length)] );
    }
  }

  startQuiz(quizLength: number, availableNotes: string[]) {

    this.quizLength = quizLength;

    // clear quiz data
    this.quizNotes.length = 0;
    this.quizResults.length = 0;

    this.inProgress = true;
    this.quizIndex = 0;
    this.score = 0;

    // generate random notes from the availableNotes array
    for(let i=0;i<this.quizLength;i++) {
      this.quizNotes.push( availableNotes[Math.floor(Math.random()* availableNotes.length)] );
    }
  }

  getCurrentNoteId() {
    return this.quizNotes[this.quizIndex];
  }

  next() : boolean {

    // check if quiz has finished
    if(this.quizIndex == (this.quizLength - 1)) {
      this.inProgress = false;
      return false;
    }

    // otherwise move on to next quiz note.
    this.quizIndex++;
    return true;
  }

  recordResult(selectedKeyId:number, actualNote: PianoNote) {

    // update score
    if(selectedKeyId == actualNote.keyId){
      this.score++;
    }

    let result = new QuizResult();
    result.selectedKeyId = selectedKeyId;
    result.actualNote = actualNote;
    result.quizNumber = this.quizIndex + 1;

    this.quizResults.push(result);
    this.pianoQuizResultSource.next(result);
  }

}
