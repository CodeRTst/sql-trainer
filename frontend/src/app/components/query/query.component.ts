import { Component, Input } from "@angular/core";
import { Query } from "src/app/models/query";
import { Solution } from "src/app/models/solution";




@Component({
    selector: 'app-query',
    templateUrl: '/query.component.html',
    styleUrls: ['./query.component.css']
})
export class QueryComponent {


    @Input() query?: Query;
    @Input() solutions: Solution[] = [];
    @Input() canDisplayQuery: boolean = false;

    

    
    get color() {
        return this.query!.errors.length > 0 ? "danger" : "success";
    }


}