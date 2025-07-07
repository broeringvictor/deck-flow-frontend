import { Routes } from '@angular/router';
import {StudyPage} from './pages/study-page/study-page';

export const routes: Routes = [
  {
      path: '',
      loadComponent: () => import('./app').then(m => m.App),
      title: 'deck-flow',
  },
  {
    path: 'study',
    component: StudyPage,
    title: 'Study',
  }

];
