///<reference path="../../imports.ts"/>

/**
 * Created by Papa on 2/14/2016.
 */


module to.revenue.us {

  export class ListAdEngine extends to.revenue.ListAdEngine {

    getListAdPositions(
      list:any[],
      listType:number
    ):number[] {
      let adPositionList:number[] = [listType];

      return adPositionList;
    }

  }


}
