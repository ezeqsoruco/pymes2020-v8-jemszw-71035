import { Component, OnInit } from "@angular/core";
import { EmpresasService } from "../../services/empresas.service";
import { Empresa } from "../../models/empresa";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.css"]
})
export class EmpresasComponent implements OnInit {
  Titulo = "Empresas";
  TituloAccionABMC = {
    A: "(Agregar)",
    L: "(Listado)"
  };

  Items: Empresa[] = [];

  AccionABMC = "L";

  FormReg: FormGroup;
  submitted = false;

  constructor(
    private empresasService: EmpresasService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.GetEmpresas();

    this.FormReg = this.formBuilder.group({
      idservicio: [0],
      descripcion: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
      ],
      importe: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      cantidadhoras: [
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

  Agregar(){
    
  }
}
