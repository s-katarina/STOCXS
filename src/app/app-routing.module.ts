import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TabelsComponent } from './tabels/tabels.component';
import { GraphComponent } from './graph/graph.component';

const routes: Routes = [
  {path: 'main', component: MainComponent},
  {path: 't', component: TabelsComponent},
  {path: 'g', component: GraphComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
