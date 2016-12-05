import { RouterModule } from '@angular/router';
import {AboutComponent} from "./about.component";



const routes = [
  { path: 'about', component: AboutComponent },
];

export const AboutRoutes = RouterModule.forChild(routes);
