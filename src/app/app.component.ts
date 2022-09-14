import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CustomService } from './custom.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})



export class AppComponent implements OnInit{
  private _serviceObj: CustomService;
  private lastFound: {lugar: string, date: Date}[] = [];
  //el script va a andar cada 2 minutos. Cambiar la cantidad de segundos si se quiere
  private timer: number = 120000;
  //reemplazar token
  private readonly telegramTokenFigus: string = "---";
  //reemplazar chatID
  private readonly groupChatIDFigus: string = "---";
  //mandar telegram cada XX min si se sigue encontrando
  private actualizarCada: number = 30;
  
  ngOnInit(): void {
    // agregar url para el post request
    var url = "---";

    const source = interval(this.timer);

    //está linea de código corre la función en donde está la magia
    //elegir nombre del lugar donde se quiere buscar! (ejemplo, "casa")
    source.subscribe(val => this.loadAvailabilityForAll("---", url));

    //si queres correr otro, lo podes hacer con la siguiente linea. En este caso, se correría 5 segundos despues
    //setTimeout(() => {source.subscribe(val => this.loadAvailabilityForAll("casa2"));}, 5000);
  }


  loadAvailabilityForAll(lugar: string, url: string): void {
    this._obj.getCustomerData(url).subscribe((resp: any)=>{
      const dateObj: any[] = resp;
      var hayFigus: boolean = false;

      console.log(lugar, '\n', dateObj, '\n', dateObj[0].value);

      if(dateObj[0].value.length > 0 && dateObj[0].value[0].in_stock === true && dateObj[0].value[0].id === "166962_2111748043") {
        hayFigus = true;
      }

      if(hayFigus) {
        //si hay figus, ver si ya se había encontrado o si es la primera vez. Si es la primera vez,
        //ver si es cerca de casa o no, y guardarlo en lastFound
        if(this.lastFound.length === 0) {
          this.lastFound.push({lugar: lugar, date: new Date()});
          let text = "Hay figuritas disponibles en Rappi cerca de " + lugar;
          this.sendTelegram(text);
        }

        //si hay figus pero no es la primera vez, entonces iterar por lastFound
        else {
          for(var found of this.lastFound) {
            //si ya se había encontrado cerca de casa, entonces ver si fue hace menos de 30 min
            // y de ser así, mandar telegram y cambiar date en lastFound
            if (found.lugar === lugar) {
              let currDate: Date = new Date();
              if(this.dateDifferenceInMinutesIsGreaterThan(found.date, currDate, this.actualizarCada)) {
                found.date = currDate;
                let text = "Hay figuritas disponibles en Rappi cerca de " + lugar;
                this.sendTelegram(text);
              } 
            }
            //si no se encontró match, entonces ver si es cerca de casa o no y cargar un nuevo
            //objecto en lastFound y mandar telegram
            else {
              this.lastFound.push({lugar: lugar, date: new Date()});
              let text = "Hay figuritas disponibles en Rappi cerca de " + lugar;
              this.sendTelegram(text);
            }
          }
        }
      }

    })
  }

  
  title = 'rappi-figuritas';

  constructor(private _obj:CustomService) {
    this._serviceObj = _obj;
  }

  dateDifferenceInMinutesIsGreaterThan(startDate: Date, endDate: Date, maxMinutes: number): boolean {
    var result: boolean = false;
    var msDiff = endDate.getTime() - startDate.getTime();
    var minDiff = msDiff / 60 / 1000;
    var hDiff = msDiff / 3600 / 1000;
    var hours = Math.floor(hDiff);
    var minutes = minDiff - 60 * hours;
    if(minutes > maxMinutes) {
      return true;
    }
    else {
      return false;
    }
  }

  sendTelegram(text: string) {
    let url = "https://api.telegram.org/bot" + this.telegramTokenFigus + "/sendMessage?chat_id=" + this.groupChatIDFigus + "&text=" + text + "&parse_mode=html";
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
  }

}
