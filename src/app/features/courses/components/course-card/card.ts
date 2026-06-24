import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import {
  CurrencyPipe
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { Course } from '../../models/course.model';

@Component({
  selector: 'app-card',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly data = input.required<Course | any>();
}