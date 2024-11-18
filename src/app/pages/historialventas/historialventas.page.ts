import { Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-historialventas',
  templateUrl: './historialventas.page.html',
  styleUrls: ['./historialventas.page.scss'],
})
export class HistorialventasPage implements OnInit {


constructor(private bdService: ServiceBDService) { }

ngOnInit() {
  
}



}





