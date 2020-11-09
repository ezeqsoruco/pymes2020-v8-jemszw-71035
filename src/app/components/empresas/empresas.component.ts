import { Component, OnInit } from "@angular/core";
import { EmpresasService } from "../../services/empresas.service";
import { Empresa } from "../../models/empresa";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.css"]
})
export class EmpresasComponent implements OnInit {
  Titulo = "Empresas";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };

  Items: Empresa[] = [];

  AccionABMC = "L";

  FormReg: FormGroup;
  submitted = false;

  constructor(
    private empresasService: EmpresasService,
    public formBuilder: FormBuilder,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.GetEmpresas();

    this.FormReg = this.formBuilder.group({
      IdEmpresa: [0],
      RazonSocial: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
      ],
      FechaFundacion: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      CantidadEmpleados: [
        null,
        [Validators.required, Validators.pattern("[0-9]{1,7}")]
      ]
    });
  }

  GetEmpresas() {
    this.empresasService.get().subscribe((res: Empresa[]) => {
      this.Items = res;
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset();
    this.submitted = false;
    this.FormReg.markAsUntouched();
  }

  Consultar() {
    this.AccionABMC = "L";
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaAlta.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (itemCopy.IdEmpresa == 0 || itemCopy.IdEmpresa == null) {
      itemCopy.IdEmpresa = 0;
      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert("Registro agregado correctamente.");
      });
    } else {
      // modificar put
      this.empresasService
        .put(itemCopy.IdEmpresa, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert("Registro modificado correctamente.");
        });
    }
  }
}
