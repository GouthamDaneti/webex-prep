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
    this.initWebexSDK();
    this.listenForToken();
    this.routeToRooms();
    //this.initWebexSDKWithToken();
  }

  initWebexSDK() {
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
  }

  async listenForToken() {
    this.webex.once(`ready`, () => {
      console.log("READY with Token: ", this.webex.credentials.supertoken);
      if (this.webex.credentials.supertoken){
        localStorage.setItem('webex_token', this.webex.credentials.supertoken.access_token)
      }
    });
  }

  routeToRooms() {
    new Promise(resolve => setTimeout(() => {
        if (localStorage.getItem('webex_token')) {
            this.router.navigate(['/rooms'])
        } else if (this.redirectRoomsCount < 5){
            this.redirectRoomsCount++;
            this.routeToRooms();
        } else {
          window.alert("Token not set, while login. So, not redirecting to rooms.");
        }
      }, 250));
  }
}
