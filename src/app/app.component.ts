import { Component, OnInit } from '@angular/core';
import ConectorPluginV3 from "./ConectorPluginV3";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  title = 'thermal-printer-angular';
  impresoras = [];
  impresoraSeleccionada: string = "";
  mensaje: string = "";

  async ngOnInit() {
    this.impresoras = await ConectorPluginV3.obtenerImpresoras();
  }

  async probarImpresion() {
    if (!this.impresoraSeleccionada) {
      return alert("Seleccione una impresora");
    }

    if (!this.mensaje) {
      return alert("Escribe un mensaje");
    }
    const conector = new ConectorPluginV3();
    conector
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .EscribirTexto("Hola Angular desde parzibyte.me")
      .Feed(1)
      .EscribirTexto(this.mensaje)
      .Feed(1)
      .DescargarImagenDeInternetEImprimir("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
      .Iniciar()
      .Feed(1);
    const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);
    if (respuesta == true) {
      console.log("Impresión correcta");
    } else {
      console.log("Error: " + respuesta);
    }
  }
}
