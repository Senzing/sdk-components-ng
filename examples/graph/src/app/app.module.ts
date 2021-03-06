import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SenzingSdkModule, SzRestConfiguration, SzPoweredByComponent  } from '@senzing/sdk-components-ng';
import { SenzingSdkGraphModule } from '@senzing/sdk-graph-components';
import { AppComponent } from './app.component';

/**
* Pull in api configuration(SzRestConfigurationParameters)
* from: environments/environment
*
* @example
* ng build -c production
* ng serve -c docker
*/
import { apiConfig, environment } from './../environments/environment';

/**
 * create exportable config factory
 * for AOT compilation.
 *
 * @export
 */
export function SzRestConfigurationFactory() {
  return new SzRestConfiguration( (apiConfig ? apiConfig : undefined) );
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SenzingSdkModule.forRoot( SzRestConfigurationFactory ),
    SenzingSdkGraphModule.forRoot( SzRestConfigurationFactory )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
