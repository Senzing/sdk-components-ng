import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SzSearchResultEntityData } from '../../../models/responces/search-results/sz-search-result-entity-data';
import { SzEntityDetailSectionData } from '../../../models/entity-detail-section-data';

import {
  SzEntityData,
  SzResolvedEntity,
  SzEntityRecord
} from '@senzing/rest-api-client-ng';

/**
 * @internal
 * @export
 */
@Component({
  selector: 'sz-entity-record-card-content',
  templateUrl: './sz-entity-record-card-content.component.html',
  styleUrls: ['./sz-entity-record-card-content.component.scss']
})
export class SzEntityRecordCardContentComponent implements OnInit {
  //@Input() entity: ResolvedEntityData | SearchResultEntityData | EntityDetailSectionData | EntityRecord;
  _entity: any;
  @Input() set entity(value) {
    //console.log('set entity: ', value);
    this._entity = value;
  }
  get entity() {
    return this._entity;
  }

  @Input() maxLinesToDisplay = 3;

  @Input() set parentEntity( value ) {
    this._parentEntity = value;
    if(value && value.matchKey) {
      this._matchKeys = this.getMatchKeysAsArray(value);
    }
  } // only used for displaying "linked" icons on field data(primarily on entity details relationships)

  @Input() truncateResults: boolean = true;
  @Input() truncatedTooltip: string = "Show more..";
  // css class bool
  collapsed: boolean = this.truncateResults;

  @ViewChild('columnOne')
  private columnOne: ElementRef;
  @ViewChild('columnTwo')
  private columnTwo: ElementRef;
  @ViewChild('columnThree')
  private columnThree: ElementRef;
  @ViewChild('columnFour')
  private columnFour: ElementRef;

  _parentEntity: any;
  _matchKeys: string[];

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    setTimeout(() => {
      //this.columnOneTotal = this.columnOne ? this.columnOne.nativeElement.children.length : 0;
      //this.columnTwoTotal = this.columnTwo.nativeElement.children.length;
      //this.columnThreeTotal = this.columnThree.nativeElement.children.length;
      //this.columnFourTotal = this.columnFour.nativeElement.children.length;

      this.ref.markForCheck();
    });
  }

  getNameAndAttributeData(nameData: string[], attributeData: string[]): string[] {
    return nameData.concat(attributeData);
  }

  getAddressAndPhoneData(addressData: string[], phoneData: string[]): string[] {
    return addressData.concat(phoneData);
  }

  // ----------------- start total getters -------------------

  get columnOneTotal(): number {
    if (this.entity.entityName && this.entity.addressData) {
      return this.entity.addressData.length;
    }
    return 0;
  }
  get showColumnOne(): boolean {
    return false;
    //return (this.entity && this.entity.addressData && this.entity.addressData.length > 0);
  }
  get columnTwoTotal(): number {
    return (this.nameData.concat(this.attributeData).length);
  }
  get columnThreeTotal(): number {
    return (this.addressData.concat(this.phoneData).length);
  }
  get columnFourTotal(): number {
    return this.identifierData.length;
  }
  public get showColumnFour(): boolean {
    return this.identifierData.length > 0;
  }
  // -----------------  end total getters  -------------------

  get otherData(): string[] {
    if (this.entity) {
      if (this.entity && this.entity.nameData) {
        return this.entity.nameData;
      } else if (this.entity && this.entity.nameData) {
        return this.entity.nameData;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  get nameData(): string[] {
    if (this.entity) {
      if (this.entity && this.entity.nameData && this.entity.nameData.length > 0) {
        return this.entity.nameData;
      } else if (this.entity && this.entity.bestName) {
        return [this.entity.bestName];
      } else if (this.entity && this.entity.entityName) {
        return [this.entity.entityName];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  get attributeData(): string[] {
    if (this.entity) {
      if ( this.entity.attributeData) {
        return this.entity.attributeData;
      } else if ( this.entity.attributeData) {
        return this.entity.attributeData;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  get addressData(): string[] {
    if (this.entity) {
      if (this.entity.addressData) {
        return this.entity.addressData;
      } else if (this.entity.addressData) {
        return this.entity.addressData;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  get phoneData(): string[] {
    if (this.entity) {
      if (this.entity.phoneData) {
        return this.entity.phoneData;
      } else if (this.entity.phoneData) {
        return this.entity.phoneData;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  getMatchKeysAsArray(pEntity: any): string[] {
    let ret = [];

    if(pEntity && pEntity.matchKey) {
      const mkeys = pEntity.matchKey
      .split(/[-](?=\w)/)
      .filter(i => !!i)
      .filter( val => val.indexOf('+') >= 0 )
      .forEach( val=> {
        val.split('+').forEach( key => {
          if(key !== '+' && key !== '') { ret.push(key); }
        });
      });
      // for address, also add other text keys
      if(ret.indexOf('ADDRESS') >= 0) {
        ret = ret.concat(['BILLING', 'MAILING']);
      }

      return ret;
    }

    return ret;
  }

  get matchKeys(): string[] {
    if(this._matchKeys) {
      return this._matchKeys;
    }
    // no match keys, should we retest?
  }

  isLinkedAttribute(attrValue: string): boolean {
    const matchArr = this.matchKeys;
    if(attrValue && matchArr && matchArr.length > 0) {

      const keyMatch = matchArr.some( (mkey) => {
        return attrValue.indexOf(mkey+':') >=0 ;
      });

      //console.log(attrValue+ 'MATCHES VALUE IN: ('+keyMatch+')', matchArr);
      return keyMatch;
    } else {
      //console.warn('isLinkedAttribute issue. ', attrValue, matchArr);
    }
    return false;
  }

  get identifierData(): string[] {
    if (this.entity) {
      if (this.entity.identifierData) {
        return this.entity.identifierData;
      } else if (this.entity.identifierData) {
        return this.entity.identifierData;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  /**
   * @deprecated
   */
  private isEntityRecord(data: SzSearchResultEntityData | SzEntityDetailSectionData | SzEntityRecord): data is SzEntityRecord {
    if (data) {
      return (<SzEntityRecord>data).relationshipData !== undefined && (<SzEntityRecord>data).relationshipData.length > 0;
    }
  }
  /**
   * @deprecated
   */
  private isEntityDetailData(data: SzSearchResultEntityData | SzEntityDetailSectionData | SzEntityRecord): data is SzEntityDetailSectionData {
    if (data) {
      return (<SzEntityDetailSectionData>data).matchLevel !== undefined;
    }
  }
}
