///<reference path="../imports.ts"/>

/**
 * Created by Papa on 2/15/2016.
 */
module to.revenue {

  export enum ListAdType {
  }

  export abstract class ListAdEngine {

    moreAds = false;

    addAddsToList(
      list:any[],
      listType:ListAdType
    ):any[] {

      let listAdPositions:number[] = this.getListAdPositions(list, listType);


      let totalNumItems = list.length + listAdPositions.length;
      if (!this.moreAds) {
        totalNumItems--;
      }
      let numAddsAdded = 0;

      for (let i = 0; i < totalNumItems; i++) {
        let adIndex:number = this.getAdIndex(i, listAdPositions);
        if (adIndex) {
          let ad:Ad = {};
          list.splice(i, 0, ad);
        }
      }

      return list;
    }

    abstract getListAdPositions(
      list:any[],
      listType:ListAdType
    ):number[];

    getAdIndex(
      listPosition:number,
      listAdPositions:number[]
    ):number {
      let adIndex:number;

      listAdPositions.some(( listAdPosition ) => {
        if (listAdPosition === listPosition) {
          adIndex = listAdPosition;
          return true;
        }
      });

      return adIndex;
    }
  }

}
