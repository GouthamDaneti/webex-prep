import { Component, OnInit } from "@angular/core";
import WebexSDK from 'webex';
import { FormsModule } from '@angular/forms';
//import { FormsModule } from "@angular/forms";
/*@NgModule({imports: [FormsModule]})*/
@Component({
  selector: 'app-room',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  currRoomName: string;
  message: string;
  webex: any;

  memberEmail: string;
  createdRoom: any;
  sentMessage: any;
  membership: any;

  constructor() {}

  ngOnInit() {
    console.log("Goutham's, Token value is: " + localStorage.getItem('webex_token'));
    if (localStorage.getItem('webex_token')) {
      this.webex = WebexSDK.init({
          config: {
            meetings: {
              deviceType: 'WEB'
            }
          },
          credentials: {
            access_token: localStorage.getItem('webex_token')
          }
      });
    } else {
      window.alert("Token not set, while login.");
    }
  }

  async createRoom() {
      console.log("Token value is available: " + localStorage.getItem('webex_token'));

      if (this.webex.canAuthorize) {
          console.log("Is authorized.");
      }
      console.log("Current Room name: " + this.currRoomName);

      if(this.currRoomName) {
        try {
          this.createdRoom = await this.webex.rooms.create({ title: this.currRoomName })
          alert("Your room has been created: " + this.currRoomName);
          console.log(this.createdRoom);
        } catch(error) {
          window.alert(error);
        }
      } else {
        console.log("Room name is not specified.");
      }
  }

  async sendMessage() {
      if (this.createdRoom && this.createdRoom.id != null) {
          this.sentMessage = await this.webex.messages.create({text: this.message, roomId: this.createdRoom.id});
          console.log(this.sentMessage);
      } else {
        console.log("Unable to send message.");
      }
  }

  async addPeople() {
    if (this.createdRoom && this.createdRoom.id != null) {
        this.membership = this.webex.memberships.create({ personEmail: this.memberEmail, roomId: this.createdRoom.id});
        console.log(this.membership);
    } else {
      console.log("Unable to add member.");
    }
  }

  /*listRooms() {
    this.webex.onListRoom().then((rooms) => {
      console.log(rooms)
    })
  }

  onLogout() {
    this.webex.onLogout()
  }*/
}
