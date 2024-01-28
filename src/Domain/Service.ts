import { sp } from "@pnp/sp/presets/all";
import { IDropdownOption } from "office-ui-fabric-react";


export default class SPListService {
   // private _siteURL: string = "";
    public _top: number = 5000;
    public ROW_LIMIT: number = 2000;
    public _webURL: string;
    public web: any;



    public async CreateListItem(ListName: string, metadata: any): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(ListName).items.add(metadata);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async CreateListItems(ListName: string, items: any): Promise<any> {
        if (!ListName || !items || !items.length) {
            return false
        }
        try {
            const size = 300;
            const len = Math.ceil(items.length / size);
            const remainder = items.length % size;
            let list = sp.web.lists.getByTitle(ListName);
            const entityTypeFullName = await list.getListItemEntityTypeFullName();
            const results: any = [];
            for (let i = 0; i < len; i++) {
                const batchSize = len - 1 === i && remainder > 0 ? remainder : size;
                let batch = sp.web.createBatch();
                for (let j = 0; j < batchSize; j++) {
                    const index = i * size + j;
                    list.items.inBatch(batch).add(items[index], entityTypeFullName).then(response => {
                        results.push(response.data);
                    })
                }
                await batch.execute();

            }
            return results;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async UpdateListItemById(itemId: number, metadata: any, listName: string): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(listName).items.getById(itemId).update(metadata);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetListItemById(listName: string, itemId: number): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(listName).items.filter("ID eq " + itemId).get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Fetch list items - not all items

    public async GetListItem(listName: string, queryColumn: string, filterQuery: string, expand: string = "", orderBy: string = "ID"): Promise<any> {
        try {
            if (expand === "") {
                return await sp.web.lists.getByTitle(listName).items.select(queryColumn).top(this._top).filter(filterQuery).orderBy(orderBy).get();
            } else if (filterQuery === "") {
                return await sp.web.lists.getByTitle(listName).items.top(this._top).select(queryColumn).expand(expand).orderBy(orderBy).get();
            } else {
                return await sp.web.lists.getByTitle(listName).items.top(this._top).filter(filterQuery).select(queryColumn).expand(expand).orderBy(orderBy).get();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /** *
     Get list all items
     @param columns : List of columns separated by comma
     */

    public async GetAllListItems(listName: string, columns: string): Promise<any> {
        try {
            if (columns) {
                return await sp.web.lists.getByTitle(listName).items.select(columns).getAll();
            }
            return await sp.web.lists.getByTitle(listName).items.getAll();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async DeleteListItemById(listName:string, itemId:number):Promise<any>{
        try{
           return await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
        }catch(error){
            return Promise.reject(error);
        }
    }

    /** 
     Create the dropdown option from the list data
       @param listName
       @param displayName
       @param orderByAsc
    */
    
    public async GetMasterDataOption(listName:string, displayColumnName:string,orderByAsc:boolean):Promise<any>{
        return new Promise((resolve,reject)=>{
            try{
                sp.web.lists.getByTitle(listName).items.select("").orderBy(displayColumnName,orderByAsc).top(this._top).getAll()
                .then((response)=>{
                    let dpOption:IDropdownOption[]=[];
                    if (response !== null) {
                        response.map((item)=>{
                            dpOption.push({key:item.Id,text:item[displayColumnName]});
                        })
                    }
                    resolve(dpOption);
                }).catch((error:any)=>{
                    reject(false);
                })
            }catch(error){
             reject(false);
            }
        })
    }

}