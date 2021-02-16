import { Component, OnInit } from "@angular/core";
import { environment } from 'src/environments/environment';
import { NgForm } from "@angular/forms";
import WebexSDK from 'webex';
import { Router } from "@angular/router";

//import { Subscription } from "rxjs";
//import { WebexService } from "../webex.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  token: string;
  webex: any;
  redirectRoomsCount = 0;
  /*@ViewChild('loginForm') loginForm: NgForm;*/

  constructor(private router: Router) {}

  async ngOnInit() {
    // Login here:
    this.initWebexSDK(this.listenForToken);
    //this.routeToRooms();
    //this.initWebexSDKWithToken();
  }

  initWebexSDK(callBackFun) {
    this.webex = WebexSDK.init({
      config: {
        meetings: {
          deviceType: 'WEB'
        },
        credentials: {
          client_id: environment.client_id,
          redirect_uri: environment.redirect_uri,
          scope: environment.scope
        }
      }
    });
    this.webex.once('ready', ()=>{
      console.log("webex is ready, so executing the later part of the code.");
      console.log(this.webex.canAuthorize);
      if(this.webex.canAuthorize) {
        // Get Login info if authorised
        this.webex.people.get('me').then(data=>{
          console.log("Data to be printed: " + data);
        })
      } else {
        debugger;
        console.log("Logging in here: ");
        this.webex.authorization.initiateLogin();
      }
    });
    callBackFun(this.routeToRooms, this.webex, this.router, this.redirectRoomsCount);
  }

  async listenForToken(callBackFun, webex, router, redirectRoomsCount) {
    webex.once(`ready`, () => {
      console.log("READY with Token: ", webex.credentials.supertoken);
      if (webex.credentials.supertoken){
        localStorage.setItem('webex_token', webex.credentials.supertoken.access_token)
      }
    });
    callBackFun(router, redirectRoomsCount, callBackFun);
  }

  routeToRooms(router, redirectRoomsCount, callBackFun) {
    new Promise(resolve => setTimeout(() => {
        if (localStorage.getItem('webex_token')) {
            router.navigate(['/rooms'])
        } else if (redirectRoomsCount < 5){
            redirectRoomsCount++;
            callBackFun(router, redirectRoomsCount);
        } else {
          window.alert("Token not set, while login. So, not redirecting to rooms.");
        }
      }, 250));
  }
}
