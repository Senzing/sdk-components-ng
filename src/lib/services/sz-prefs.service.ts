import { Injectable, Output, Input, Inject, OnDestroy } from '@angular/core';
import { Observable, fromEventPattern, Subject, BehaviorSubject, merge, timer } from 'rxjs';
import { map, tap, mapTo, takeUntil, debounce } from 'rxjs/operators';
import { Configuration as SzRestConfiguration, ConfigurationParameters as SzRestConfigurationParameters } from '@senzing/rest-api-client-ng';

import {
  EntityDataService,
  ConfigService,
  SzAttributeSearchResponse,
  SzEntityData,
  SzAttributeTypesResponse,
  SzAttributeType,
  SzAttributeSearchResult
} from '@senzing/rest-api-client-ng';
import { SzEntitySearchParams } from '../models/entity-search';
import { SzGraphConfigurationService } from '@senzing/sdk-graph-components';

export class SzSdkPrefsBase {
  public bulkSet: boolean = false;
  public prefsChanged: BehaviorSubject<any> = new BehaviorSubject<any>(this.toJSONObject());

  // the keys of methods in the object
  // to output in json, or to take as json input
  jsonKeys = [];

  // methods
  public toJSONObject() {
    const retObj = {};
    if (this.jsonKeys && this.jsonKeys.forEach) {
      this.jsonKeys.forEach((k: string) => {
        if( this[k] !== undefined){
          try{
            retObj[k] = this[k];
          } catch (err) {
            // console.warn('attempted to get prefVal, but pref unset. ', err)
          };
        }
      });
    }
    return retObj;
  }
  public fromJSONObject(value: string) {
    this.bulkSet = true;
    let _isChanged = false;
    if (this.jsonKeys && this.jsonKeys.forEach) {
      this.jsonKeys.forEach((k: string) => {
        if( value[k] !== undefined ){
          try{
            this[k] = value[k];
            _isChanged = true;
          } catch (err) {
            // console.warn('attempted to get prefVal, but pref unset. ', err)
          };
        }
      });
    }
    this.bulkSet = false;
    if(_isChanged){
      this.prefsChanged.next( this.toJSONObject() );
    }
  }
  public toJSONString(): string {
    return JSON.stringify(this.toJSONObject());
  }
}

export class SzSearchFormPrefs extends SzSdkPrefsBase {
  // private vars
  private _allowedTypeAttributes: string[] = [
    'SSN_NUMBER',
    'PASSPORT_NUMBER',
    'TRUSTED_ID_NUMBER'
  ];
  // json key that are output through
  // toJSONObject and fromJSONObject
  jsonKeys = [
    'allowedTypeAttributes'
  ]

  // getters and setters
  public get allowedTypeAttributes(): string[] {
    return this._allowedTypeAttributes;
  }
  public set allowedTypeAttributes(value: string[]) {
    this._allowedTypeAttributes = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }

  /**
   * publish out a "first" real payload so that
   * subscribers get an initial payload from this subclass
   * instead of the empty superclass
   **/
  constructor(){
    super();
    this.prefsChanged.next( this.toJSONObject() );
  }

}

export class SzSearchResultsPrefs extends SzSdkPrefsBase {
  // private vars
  private _openInNewTab: boolean = false;
  private _showOtherData: boolean = false;
  private _truncateRecordsAt: number = 3;
  private _showEmbeddedGraph?: boolean = false;
  private _linkToEmbeddedGraph?: boolean = false;
  private _showAttributeData: boolean = false;
  private _truncateOtherDataAt: number = 3;
  private _truncateAttributeDataAt: number = 3;
  private _showRecordIds: boolean = false;

  // json key that are output through
  // toJSONObject and fromJSONObject
  jsonKeys = [
    'openInNewTab',
    'showOtherData',
    'showAttributeData',
    'truncateRecordsAt',
    'truncateOtherDataAt',
    'truncateAttributeDataAt',
    'showEmbeddedGraph',
    'showRecordIds',
    'linkToEmbeddedGraph'
  ]

  // getters and setters
  public get openInNewTab(): boolean {
    return this._openInNewTab;
  }
  public set openInNewTab(value: boolean) {
    this._openInNewTab = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showOtherData(): boolean {
    return this._showOtherData;
  }
  public set showOtherData(value: boolean) {
    this._showOtherData = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showAttributeData(): boolean {
    return this._showAttributeData;
  }
  public set showAttributeData(value: boolean) {
    this._showAttributeData = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showRecordIds(): boolean {
    return this._showRecordIds;
  }
  public set showRecordIds(value: boolean) {
    this._showRecordIds = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get truncateRecordsAt(): number {
    return this._truncateRecordsAt;
  }
  public set truncateRecordsAt(value: number) {
    this._truncateRecordsAt = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get truncateOtherDataAt(): number {
    return this._truncateOtherDataAt;
  }
  public set truncateOtherDataAt(value: number) {
    this._truncateOtherDataAt = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get truncateAttributeDataAt(): number {
    return this._truncateAttributeDataAt;
  }
  public set truncateAttributeDataAt(value: number) {
    this._truncateAttributeDataAt = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showEmbeddedGraph(): boolean {
    return this._showEmbeddedGraph;
  }
  public set showEmbeddedGraph(value: boolean) {
    this._showEmbeddedGraph = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get linkToEmbeddedGraph(): boolean {
    return this._linkToEmbeddedGraph;
  }
  public set linkToEmbeddedGraph(value: boolean) {
    this._linkToEmbeddedGraph = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }

  /**
   * publish out a "first" real payload so that
   * subscribers get an initial payload from this subclass
   * instead of the empty superclass
   **/
  constructor(){
    super();
    this.prefsChanged.next( this.toJSONObject() );
  }
}
export class SzEntityDetailPrefs extends SzSdkPrefsBase {
  private _showGraphSection: boolean = true;
  private _showMatchesSection: boolean = true;
  private _showPossibleMatchesSection: boolean = true;
  private _showPossibleRelationshipsSection: boolean = true;
  private _showDisclosedSection: boolean = true;
  private _graphSectionCollapsed: boolean = false;
  private _recordsSectionCollapsed: boolean = false;
  private _possibleMatchesSectionCollapsed: boolean = false;
  private _possibleRelationshipsSectionCollapsed: boolean = false;
  private _disclosedRelationshipsSectionCollapsed: boolean = false;
  private _rememberSectionCollapsedState: boolean = true;
  private _truncateSummaryAt: number = 4;
  private _showOtherData: boolean = true;
  private _truncateOtherDataAt: number = 5;
  private _openLinksInNewTab: boolean = false;
  private _showOtherDataInRecords: boolean = true;
  private _showOtherDataInEntities: boolean = false;
  private _showOtherDataInSummary: boolean = false;
  private _truncateOtherDataInRecordsAt: number = 5;
  private _hideGraphWhenZeroRelations: boolean = true;
  private _showRecordIdWhenNative: boolean = false;
  private _showTopEntityRecordIdsWhenSingular: boolean = false;

  // json key that are output through
  // toJSONObject and fromJSONObject
  jsonKeys = [
    'showGraphSection',
    'showMatchesSection',
    'showPossibleMatchesSection',
    'showPossibleRelationshipsSection',
    'showDisclosedSection',
    'graphSectionCollapsed',
    'recordsSectionCollapsed',
    'possibleMatchesSectionCollapsed',
    'possibleRelationshipsSectionCollapsed',
    'disclosedRelationshipsSectionCollapsed',
    'rememberSectionCollapsedState',
    'truncateSummaryAt',
    'showOtherData',
    'truncateOtherDataAt',
    'openLinksInNewTab',
    'showOtherDataInRecords',
    'showOtherDataInEntities',
    'showOtherDataInSummary',
    'truncateOtherDataInRecordsAt',
    'hideGraphWhenZeroRelations',
    'showRecordIdWhenNative',
    'showTopEntityRecordIdsWhenSingular'
  ]

  // getters and setters
  public get showGraphSection(): boolean {
    return this._showGraphSection;
  }
  public set showGraphSection(value: boolean) {
    this._showGraphSection = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showMatchesSection(): boolean {
    return this._showMatchesSection;
  }
  public set showMatchesSection(value: boolean) {
    this._showMatchesSection = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showPossibleMatchesSection(): boolean {
    return this._showPossibleMatchesSection;
  }
  public set showPossibleMatchesSection(value: boolean) {
    this._showPossibleMatchesSection = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showPossibleRelationshipsSection(): boolean {
    return this._showPossibleRelationshipsSection;
  }
  public set showPossibleRelationshipsSection(value: boolean) {
    this._showPossibleRelationshipsSection = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showDisclosedSection(): boolean {
    return this._showDisclosedSection;
  }
  public set showDisclosedSection(value: boolean) {
    this._showDisclosedSection = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get graphSectionCollapsed(): boolean {
    return this._graphSectionCollapsed;
  }
  public set graphSectionCollapsed(value: boolean) {
    this._graphSectionCollapsed = value;
    if(!this.bulkSet && this._rememberSectionCollapsedState) this.prefsChanged.next( this.toJSONObject() );
  }
  public get recordsSectionCollapsed(): boolean {
    return this._recordsSectionCollapsed;
  }
  public set recordsSectionCollapsed(value: boolean) {
    this._recordsSectionCollapsed = value;
    if(!this.bulkSet && this._rememberSectionCollapsedState) this.prefsChanged.next( this.toJSONObject() );
  }
  public get possibleMatchesSectionCollapsed(): boolean {
    return this._possibleMatchesSectionCollapsed;
  }
  public set possibleMatchesSectionCollapsed(value: boolean) {
    this._possibleMatchesSectionCollapsed = value;
    if(!this.bulkSet && this._rememberSectionCollapsedState) this.prefsChanged.next( this.toJSONObject() );
  }
  public get possibleRelationshipsSectionCollapsed(): boolean {
    return this._possibleRelationshipsSectionCollapsed;
  }
  public set possibleRelationshipsSectionCollapsed(value: boolean) {
    this._possibleRelationshipsSectionCollapsed = value;
    if(!this.bulkSet && this._rememberSectionCollapsedState) this.prefsChanged.next( this.toJSONObject() );
  }
  public get disclosedRelationshipsSectionCollapsed(): boolean {
    return this._disclosedRelationshipsSectionCollapsed;
  }
  public set disclosedRelationshipsSectionCollapsed(value: boolean) {
    this._disclosedRelationshipsSectionCollapsed = value;
    if(!this.bulkSet && this._rememberSectionCollapsedState) this.prefsChanged.next( this.toJSONObject() );
  }
  public get rememberSectionCollapsedState(): boolean {
    return this._rememberSectionCollapsedState;
  }
  public set rememberSectionCollapsedState(value: boolean) {
    this._rememberSectionCollapsedState = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get truncateSummaryAt(): number {
    return this._truncateSummaryAt;
  }
  public set truncateSummaryAt(value: number) {
    this._truncateSummaryAt = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showOtherData(): boolean {
    return this._showOtherData;
  }
  public set showOtherData(value: boolean) {
    this._showOtherData = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get truncateOtherDataAt(): number {
    return this._truncateOtherDataAt;
  }
  public set truncateOtherDataAt(value: number) {
    this._truncateOtherDataAt = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get openLinksInNewTab(): boolean {
    return this._openLinksInNewTab;
  }
  public set openLinksInNewTab(value: boolean) {
    this._openLinksInNewTab = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showOtherDataInRecords(): boolean {
    return this._showOtherDataInRecords;
  }
  public set showOtherDataInRecords(value: boolean) {
    this._showOtherDataInRecords = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showOtherDataInEntities(): boolean {
    return this._showOtherDataInEntities;
  }
  public set showOtherDataInEntities(value: boolean) {
    this._showOtherDataInEntities = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showOtherDataInSummary(): boolean {
    return this._showOtherDataInSummary;
  }
  public set showOtherDataInSummary(value: boolean) {
    this._showOtherDataInSummary = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get truncateOtherDataInRecordsAt(): number {
    return this._truncateOtherDataInRecordsAt;
  }
  public set truncateOtherDataInRecordsAt(value: number) {
    this._truncateOtherDataInRecordsAt = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get hideGraphWhenZeroRelations(): boolean {
    return this._hideGraphWhenZeroRelations;
  }
  public set hideGraphWhenZeroRelations(value: boolean) {
    this._hideGraphWhenZeroRelations = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showRecordIdWhenNative(): boolean {
    return this._showRecordIdWhenNative;
  }
  public set showRecordIdWhenNative(value: boolean) {
    this._showRecordIdWhenNative = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showTopEntityRecordIdsWhenSingular(): boolean {
    return this._showTopEntityRecordIdsWhenSingular;
  }
  public set showTopEntityRecordIdsWhenSingular(value: boolean) {
    this._showTopEntityRecordIdsWhenSingular = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }



  /**
   * publish out a "first" real payload so that
   * subscribers get an initial payload from this subclass
   * instead of the empty superclass
   **/
  constructor(){
    super();
    this.prefsChanged.next( this.toJSONObject() );
  }
}

/**
 * TODO: move this to graph package
 * and have this file import from npm package
 */
export class SzGraphPrefs extends SzSdkPrefsBase {
  // private vars
  public _openInNewTab: boolean = false;
  public _openInSidePanel: boolean = false;
  public _dataSourceColors = {
    'owners':'#0088ff'
  };
  public _showMatchKeys: boolean = false;
  private _rememberStateOptions: boolean = true;
  public _maxDegreesOfSeparation: number = 3;
  public _maxEntities: number = 3;
  public _buildOut: number = 1;

  // json key that are output through
  // toJSONObject and fromJSONObject
  jsonKeys = [
    'openInNewTab',
    'openInSidePanel',
    'dataSourceColors',
    'showMatchKeys',
    'rememberStateOptions',
    'maxDegreesOfSeparation',
    'maxEntities',
    'buildOut'
  ]

  // getters and setters
  public get openInNewTab(): boolean {
    return this._openInNewTab;
  }
  public set openInNewTab(value: boolean) {
    this._openInNewTab = value;
    if(!this.bulkSet && this._rememberStateOptions) this.prefsChanged.next( this.toJSONObject() );
  }
  public get openInSidePanel(): boolean {
    return this._openInSidePanel;
  }
  public set openInSidePanel(value: boolean) {
    this._openInSidePanel = value;
    if(!this.bulkSet && this._rememberStateOptions) this.prefsChanged.next( this.toJSONObject() );
  }
  public get dataSourceColors(): any {
    return this._dataSourceColors;
  }
  public set dataSourceColors(value: any) {
    this._dataSourceColors = value;
    if(!this.bulkSet && this._rememberStateOptions) this.prefsChanged.next( this.toJSONObject() );
  }
  public get showMatchKeys(): boolean {
    return this._showMatchKeys;
  }
  public set showMatchKeys(value: boolean) {
    this._showMatchKeys = value;
    if(!this.bulkSet && this._rememberStateOptions) this.prefsChanged.next( this.toJSONObject() );
  }
  public get rememberStateOptions(): boolean {
    return this._rememberStateOptions;
  }
  public set rememberStateOptions(value: boolean) {
    // this one doesnt need to push "next" to event bus
    // rather it controls whether the other setters send to event bus
    this._rememberStateOptions = value;
  }
  public get maxDegreesOfSeparation(): number {
    return this._maxDegreesOfSeparation;
  }
  public set maxDegreesOfSeparation(value: number) {
    this._maxDegreesOfSeparation = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get maxEntities(): number {
    return this._maxEntities;
  }
  public set maxEntities(value: number) {
    this._maxEntities = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }
  public get buildOut(): number {
    return this._buildOut;
  }
  public set buildOut(value: number) {
    this._buildOut = value;
    if(!this.bulkSet) this.prefsChanged.next( this.toJSONObject() );
  }

  /**
   * publish out a "first" real payload so that
   * subscribers get an initial payload from this subclass
   * instead of the empty superclass
   **/
  constructor(){
    super();
    this.prefsChanged.next( this.toJSONObject() );
  }
}

export interface SzSdkPrefsModel {
  searchForm?: any,
  searchResults?: any,
  entityDetail?: any,
  graph?: any
};


@Injectable({
  providedIn: 'root'
})
export class SzPrefsService implements OnDestroy {
  /** subscription to notify subscribers to unbind */
  public unsubscribe$ = new Subject<void>();
  public prefsChanged: BehaviorSubject<SzSdkPrefsModel> = new BehaviorSubject<SzSdkPrefsModel>( this.toJSONObject() );
  public searchForm?: SzSearchFormPrefs       = new SzSearchFormPrefs();
  public searchResults?: SzSearchResultsPrefs = new SzSearchResultsPrefs();
  public entityDetail?: SzEntityDetailPrefs   = new SzEntityDetailPrefs();
  public graph?: SzGraphPrefs                 = new SzGraphPrefs();

  public toJSONObject() {
    let retObj: SzSdkPrefsModel = {};

    if(this.searchForm){
      retObj.searchForm = this.searchForm.toJSONObject();
    }
    if(this.searchResults){
      retObj.searchResults = this.searchResults.toJSONObject();
    }
    if(this.entityDetail){
      retObj.entityDetail = this.entityDetail.toJSONObject();
    }
    if(this.graph){
      retObj.graph = this.graph.toJSONObject();
    }
    return retObj;
  }
  public fromJSONObject(value: SzSdkPrefsModel) {
    const _keys = Object.keys(value);
    _keys.forEach( (_k ) => {
      if( this[_k] && this[_k].fromJSONObject ){
        // object inheriting from 'SzSdkPrefsBase'
        //console.log(`setting "${_k}" via this[_k].fromJSONObject`, value[_k]);
        this[_k].fromJSONObject( value[_k] );
      } else {
        //   maybe top level property
        //   :-/
        //console.log(`setting "${_k}" via direct assignment`, value[_k], this[_k]);
        this[_k] = value[_k];
      }
    });
  }
  public fromJSONString(value: string) {
    let _sVal = JSON.parse(value);

    if(_sVal.searchForm){
      this.searchForm.fromJSONObject( _sVal.searchForm );
    }
    if(_sVal.searchResults){
      this.searchResults.fromJSONObject( _sVal.searchResults );
    }
    if(_sVal.entityDetail){
      this.entityDetail.fromJSONObject( _sVal.entityDetail );
    }
  }
  public toJSONString(): string {
    return JSON.stringify(this.toJSONObject());
  }

  constructor(){

    // listen for any prefs changes
    // as one meta-observeable
    const concat_prefchanges = merge(
      this.searchForm.prefsChanged,
      this.searchResults.prefsChanged,
      this.entityDetail.prefsChanged,
      this.graph.prefsChanged
    );
    // now filter and debounce
    // so that any back to back changes are
    // only published as a single event
    concat_prefchanges.pipe(
      takeUntil(this.unsubscribe$),
      debounce(() => timer(100))
    ).subscribe((prefsObj ) => {
      console.log('prefs changed!!', prefsObj);
      this.prefsChanged.next( this.toJSONObject() );
    });
  }

  /**
   * unsubscribe when component is destroyed
   */
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}