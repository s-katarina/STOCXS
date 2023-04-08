import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TabelsComponent } from './tabels/tabels.component';

const routes: Routes = [
  {path: 'main', component: MainComponent},
  {path: 't', component: TabelsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
