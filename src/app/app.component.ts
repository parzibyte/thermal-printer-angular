import { Component, OnInit } from '@angular/core';
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
    // https://parzibyte.me/http-esc-pos-desktop-docs/es/api/obtener-impresoras.html
    const respuestaHttp = await fetch("http://localhost:8000/impresoras");
    const impresoras = await respuestaHttp.json();
    this.impresoras = impresoras;
  }

  async probarImpresion() {
    if (!this.impresoraSeleccionada) {
      return alert("Seleccione una impresora");
    }

    if (!this.mensaje) {
      return alert("Escribe un mensaje");
    }
    // Lista de operaciones disponibles: https://parzibyte.me/http-esc-pos-desktop-docs/es/
    const operaciones = [
      {
        nombre: "Iniciar",
        argumentos: [],
      },
      {
        nombre: "EstablecerAlineacion",
        argumentos: [1],
      },

      {
        nombre: "EscribirTexto",
        argumentos: ["Hola Angular desde parzibyte.me"],
      },
      {
        nombre: "Feed",
        argumentos: [1],
      },
      {
        nombre: "EscribirTexto",
        argumentos: [this.mensaje],
      },
      {
        nombre: "Feed",
        argumentos: [1],
      },
      {
        nombre: "DescargarImagenDeInternetEImprimir",
        argumentos: ["https://github.com/parzibyte.png", 380, 0, true],
      },
    ];

    // https://parzibyte.me/http-esc-pos-desktop-docs/es/api/imprimir.html
    const cargaUtil = {
      nombreImpresora: this.impresoraSeleccionada,
      serial: "",
      operaciones: operaciones,
    };


    const respuestaHttp = await fetch("http://localhost:8000/imprimir", {
      method: "POST",
      body: JSON.stringify(cargaUtil),
    })

    const respuesta = await respuestaHttp.json();
    if (respuesta.ok) {
      console.log("Impreso correctamente");
    } else {
      console.error("Petición realizada pero error en el plugin: " + respuesta.message);
    }
  }
}
