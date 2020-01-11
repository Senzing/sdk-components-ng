import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SzPrefsService } from '../services/sz-prefs.service';
import { SzBulkDataService } from '../services/sz-bulk-data.service';
import {SzBulkDataAnalysis, SzBulkLoadResult } from '@senzing/rest-api-client-ng';
import { Subject } from 'rxjs';

/**
 * show textual summary of data load operation.
 *
 * @example
 * <sz-bulk-data-load-summary></sz-bulk-data-load-summary>
 *
 * @export
 */
@Component({
  selector: 'sz-bulk-data-load-summary',
  templateUrl: './sz-bulk-data-load-summary.component.html',
  styleUrls: ['./sz-bulk-data-load-summary.component.scss']
})
export class SzBulkDataLoadSummaryComponent implements OnInit {
  /** subscription to notify subscribers to unbind */
  public unsubscribe$ = new Subject<void>();
  /** get the file reference currently loaded in the the bulk data service */
  public get file(): File {
    if(this.bulkDataService) {
      return this.bulkDataService.currentFile;
    }
    return undefined;
  }
  /** result of last analysis operation */
  public get analysis(): SzBulkDataAnalysis {
    return this.bulkDataService.currentAnalysis;
  }
  /** get result of load operation from service */
  public get result(): SzBulkLoadResult {
    return this.bulkDataService.currentLoadResult;
  }

  constructor( public prefs: SzPrefsService,
    private bulkDataService: SzBulkDataService,
    public viewContainerRef: ViewContainerRef) {}

  ngOnInit() {}
  /**
   * unsubscribe when component is destroyed
   */
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
